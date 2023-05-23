import axios from "axios";
import { shuffle } from "lodash";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import {
  getHolyZoneId,
  getStoreList,
  setGraph,
  setLastMonthLowPrice,
  setStoreList,
} from "./function/product";
import { wrapSlept } from "./function/wrapSlept";
import { getAllProductIdType } from "./function/product_price_update";
type updateByProductIdType = {
  page?: number;
  size?: number;
  product_id_list?: number[];
};

export const updateByProductId = async ({
  page = 0,
  size = 100000,
  product_id_list,
}: updateByProductIdType) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let data: getAllProductIdType[] = await axios(
    `${NODE_API_URL}/v4/crawling/product/all?page=${page}&size=${size}`
  ).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list)
    data = data.filter((p) => product_id_list.includes(p.product_id));

  //#region (2) 성지가격있는 제품아이디 모두 제외시키기
  const exceptionList = await getHolyZoneId();
  data = data.filter((p) => !exceptionList.includes(p.product_id));
  data = shuffle(data);

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    console.time(`${product.product_id} 작업 시간`);
    const max = data.length;
    l(
      `START [${i + 1}/${max}] product_id: ${String(
        product.product_id
      ).padStart(6, " ")}`,
      "blue",
      ""
    );
    const storeList = await getStoreList(product);
    const result = await setStoreList(product, storeList);

    if (result === null) {
      l(
        `setStoreList result: false [${i + 1}/${max}] product_id: ${String(
          product.product_id
        ).padStart(6, " ")}`,
        "red",
        ""
      );
      continue;
    }

    await setGraph(product);
    await setLastMonthLowPrice(product);
    await wrapSlept(product.type === "itemscout" ? 500 : 2000);
    console.timeEnd(`${product.product_id} 작업 시간`);
    l(
      "timestamp",
      "blue",
      `${String(product.product_id).padStart(6, " ")} ` +
        new Date().toISOString()
    );
  }
  l("[DONE]", "blue", "complete - all product price update");
};
