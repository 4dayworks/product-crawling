import axios from "axios";
import { groupBy } from "lodash";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import {
  getStoreList,
  setGraph,
  setLastMonthLowPrice,
  setStoreList,
} from "./function/product";
import { getAllProductIdType } from "./function/product_price_update";
import { wrapSlept } from "./function/wrapSlept";
type updateByProductIdType = {
  page?: number;
  size?: number;
  product_id_list?: number[];
};

export const updateByProductId = async ({
  page = 0,
  size = 1000000,
  product_id_list,
}: updateByProductIdType) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let list: getAllProductIdType[] = await axios(
    `${NODE_API_URL}/v4/crawling/product/all?page=${page}&size=${size}`
  ).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list)
    list = list.filter((p) => product_id_list.includes(p.product_id));

  //#region (2) 성지가격있는 제품아이디 모두 제외시키기
  // const exceptionList = await getHolyZoneId();
  // data = data.filter((p) => !exceptionList.includes(p.product_id));

  // 배열 섞기
  // if (!product_id_list) list = shuffle(list);

  //#region itemscout / naver type에 따라서 번갈아가며 한번씩 배열에 넣기
  const grouped = groupBy(list, "type");
  const combinedList: getAllProductIdType[] = [];
  const types = ["naver", "itemscout"]; // 순서에 따라 번갈아가며 그룹화
  const maxLength = Math.max(
    grouped.naver ? grouped.naver.length : 0,
    grouped.itemscout ? grouped.itemscout.length : 0
  );
  for (let i = 3382; i < maxLength; i++) {
    types.forEach((type) => {
      if (grouped[type] && i < grouped[type].length)
        combinedList.push(grouped[type][i]);
    });
  }
  list = combinedList;

  //#endregion

  // 70000번 이상으로 거르기
  // list = list.filter((s) => s.product_id <= 70000);
  let chance = 3; //다시 시도할 기회
  for (let i = 0; i < list.length; i++) {
    // for (let i = 0; i < list.length; i++) {
    if (list.length > i) {
      const result = await setData(list[i], i, list.length);
      // l("[result]", "magenta", JSON.stringify(result));
      if (!result) {
        if (chance > 0) {
          // 문제 생겼을시 10분 또는 20초 대기 후 다음 재시도
          await wrapSlept(chance === 1 ? 600000 : 20000);
          chance--;
          if (chance === 1) i--;
          continue;
        } else {
          if (i >= 2) {
            const message = `product_id: ${
              list[i - 2].product_id
            } / product_name: ${
              list[i - 2].product_name
            } / message: continuous error`;
            await axios
              .get(`${NODE_API_URL}/slack/crawling?message=${message}`)
              .then((res) => res.data.data)
              .catch((err) => l("Err", "red", "Slack Send Message Error"));
          }
          break;
        }
      }
      chance = 3;
    }
  }
  l("[DONE]", "blue", "complete - all product price update");
};

const setData = async (
  product: getAllProductIdType,
  i: number,
  max: number
) => {
  const color = product.type === "itemscout" ? "yellow" : "green";
  const productStr = String(product.product_id).padStart(5, " ");
  const s = `[${i + 1}/${max}]id:${productStr}`;

  const startTime = new Date().getTime();

  l(
    `[${i + 1}/${max}]`,
    color,
    `id:${productStr} type:${product.type} 키워드: ${product.keyword}\n\t필수: ${product.require_keyword}\n\t제외: ${product.exception_keyword}`
  );

  // -- main logic --
  const storeList = await getStoreList(product);
  if (storeList === null) return false;

  const result = await setStoreList(product, storeList);
  // -- main logic --

  if (result === null) {
    l("Err", "red", `${s} setStoreList result: null`);
    return false;
  } else {
    await setGraph(product);
    await setLastMonthLowPrice(product);

    const executeTime = new Date().getTime() - startTime;
    const randomTime =
      Math.random() * 10000 < 5000 ? 5000 : Math.random() * 12000; //유저라는 걸 인식하기 위해 랜덤 시간
    const waitTime =
      (product.type === "itemscout" ? randomTime : randomTime) - executeTime; //500 : 2000
    await wrapSlept(waitTime < 0 ? 0 : waitTime);

    const endTime = ((new Date().getTime() - startTime) / 1000).toFixed(2);
    l(
      "TIME",
      "blue",
      `id:${productStr} 종료 시간: ${endTime}s, end_at: ${new Date().toUTCString()}, 작업 시간:${(
        executeTime / 1000
      ).toFixed(2)}s\n`
    );
    return true;
  }
};
