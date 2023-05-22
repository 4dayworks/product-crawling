import axios from "axios";
import { shuffle } from "lodash";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import {
  getAllDataByItemscout,
  setGraph,
  setLastMonthLowPrice,
} from "./function/product";
import { updateEntireProductByItemscout } from "./function/updateEntireProductByItemscout";
import { wrapSlept } from "./function/wrapSlept";
import { getAllProductIdType } from "./product_price_update";
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
  const exceptionList: number[] = await axios(
    `${NODE_API_URL}/crawling/product/holyzone/all`
  )
    .then((d) => {
      const data: { product_id: number; product_name: string }[] = d.data.data;
      return data.map((p) => p.product_id);
    })
    .catch((e) => {
      l(
        "Noti Err",
        "red",
        "성지존 알림 오류 /crawling/product/holyzone/all" + e.code
      );
      return [];
    });
  data = data.filter((p) => !exceptionList.includes(p.product_id));
  data = shuffle(data);

  for (let i = 0; i < data.length; i++) {
    const product = data[i];

    if (product.type === "itemscout") {
      const allData = await getAllDataByItemscout(product);
      await updateEntireProductByItemscout({
        ...allData,
        index: i + 1,
        max: data.length,
        originData: product,
      });
      await setGraph(product);
      await setLastMonthLowPrice(product);
      await wrapSlept(500);
    }
    // else if (product.type === "naver" && product.naver_catalog_link) {
    //   const coupangStoreList = await getCoupangStoreData(product);
    //   await getProductByNaverCatalogV2(
    //     product,
    //     i + 1,
    //     data.length,
    //     coupangStoreList
    //   );
    //   await setGraph(product);
    //   await setLastMonthLowPrice(product);
    //   await wrapSlept(2000);
    // }
    l(
      "timestamp",
      "blue",
      `${String(product.product_id).padStart(6, " ")} ` +
        new Date().toISOString()
    );
  }
  l("[DONE]", "blue", "complete - all product price update");
};
