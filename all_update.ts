import axios from "axios";
import { groupBy, shuffle } from "lodash";
import { NODE_API_URL, isLocalhost } from "./function/common";
import { l } from "./function/console";
import { getStoreList, setGraph, setLastMonthLowPrice, setStoreList } from "./function/product";
import { getAllProductIdType } from "./function/product_price_update";
import { wrapSlept } from "./function/wrapSlept";
type updateByProductIdType = {
  page?: number;
  size?: number;
  product_id_list?: number[];
};

export const updateByProductId = async ({ page = 0, size = 100000, product_id_list }: updateByProductIdType) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let list: getAllProductIdType[] = await axios(
    `${NODE_API_URL}/v4/crawling/product/all?page=${page}&size=${size}`
  ).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) list = list.filter((p) => product_id_list.includes(p.product_id));

  //#region (2) 성지가격있는 제품아이디 모두 제외시키기
  // const exceptionList = await getHolyZoneId();
  // data = data.filter((p) => !exceptionList.includes(p.product_id));

  // 배열 섞기
  if (!product_id_list) list = shuffle(list);

  //#region itemscout / naver type에 따라서 번갈아가며 한번씩 배열에 넣기
  const grouped = groupBy(list, "type");
  const combinedList: getAllProductIdType[] = [];
  const types = ["naver", "itemscout"]; // 순서에 따라 번갈아가며 그룹화
  const maxLength = Math.max(
    grouped.naver ? grouped.naver.length : 0,
    grouped.itemscout ? grouped.itemscout.length : 0
  );
  for (let i = 0; i < maxLength; i++) {
    types.forEach((type) => {
      if (grouped[type] && i < grouped[type].length) combinedList.push(grouped[type][i]);
    });
  }
  list = combinedList;
  //#endregion

  for (let i = 0; i < list.length; i++) {
    if (list.length > i) {
      // if (list.length > i && (list[i].type === "itemscout" || isLocalhost)) {
      const result = await setData(list[i], i, list.length);
      if (!result) {
        // 문제 생겼을시 20초 대기 후 다음 재시도
        wrapSlept(20000);
        continue;
      }
    }
  }
  l("[DONE]", "blue", "complete - all product price update");
};

const setData = async (product: getAllProductIdType, i: number, max: number) => {
  const color = product.type === "itemscout" ? "yellow" : "green";
  const productStr = String(product.product_id).padStart(5, " ");
  const s = `[${i + 1}/${max}]id:${productStr}`;

  const startTime = new Date().getTime();

  l(`[${i + 1}/${max}]`, color, `id:${productStr} type:${product.type}`);

  // -- main logic --
  const storeList = await getStoreList(product);
  const result = await setStoreList(product, storeList);
  // -- main logic --

  if (result === null) {
    l("Err", "red", `${s} setStoreList result: null`);
    return false;
  } else {
    await setGraph(product);
    await setLastMonthLowPrice(product);

    const executeTime = new Date().getTime() - startTime;
    const waitTime = (product.type === "itemscout" ? 500 : 2000) - executeTime;
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
