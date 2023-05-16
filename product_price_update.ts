import { getProductByNaverCatalogV2 } from "./function/getProductByNaverCatalogV2";
import { NODE_API_URL } from "./function/common";
import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { l } from "./function/console";
import { wrapSlept } from "./function/wrapSlept";
import { getProductByItemscoutV2 } from "./function/updateByItemscoutV2";
import { setGraph, setLastMonthLowPrice, shuffle } from "./function/product";
import { getAllProductIdType } from "./product_price_update.d";
import { getProductPriceData } from "./function/updateByIherb";
import { IherbPriceType } from "./product_price_update_itemscout";
import { getCoupangStoreData } from "./function/coupang/getCoupangStoreData";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateByProductId = async (product_id_list?: number[]) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let data: getAllProductIdType[] = await axios(`${NODE_API_URL}/v3/crawling/product/all`).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) data = data.filter((p) => product_id_list.includes(p.product_id));

  //#region (2) 성지가격있는 제품아이디 모두 제외시키기
  const exceptionList: number[] = await axios(`${NODE_API_URL}/crawling/product/holyzone/all`)
    .then((d) => {
      const data: { product_id: number; product_name: string }[] = d.data.data;
      return data.map((p) => p.product_id);
    })
    .catch((e) => {
      l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/all" + e.code);
      return [];
    });
  data = data.filter((p) => !exceptionList.includes(p.product_id));
  shuffle(data);

  for (let i = 0; i < data.length; i++) {
    const product = data[i];

    const coupangStoreList = await getCoupangStoreData(product);

    if (product.type === "itemscout") {
      const res =
        product.iherb_list_url && product.iherb_product_url && product.iherb_brand
          ? await getProductPriceData({
              list_url: product.iherb_list_url,
              product_url: product.iherb_product_url,
              brand: product.iherb_brand,
            })
          : null;
      const iherbPriceData: IherbPriceType | null = res
        ? {
            ...res,
            list_url: product.iherb_list_url,
            product_url: product.iherb_product_url,
            brand: product.iherb_brand,
            iherb_product_image: product.iherb_product_image,
          }
        : null;

      await getProductByItemscoutV2(product, i + 1, data.length, iherbPriceData, coupangStoreList);
      await setGraph(product);
      await setLastMonthLowPrice(product);
      await wrapSlept(500);
    } else if (product.type === "naver" && product.naver_catalog_link) {
      await getProductByNaverCatalogV2(product, i + 1, data.length, coupangStoreList);
      await setGraph(product);
      await setLastMonthLowPrice(product);
      await wrapSlept(2000);
    }
    l("timestamp", "blue", new Date().toISOString());
  }
  l("[DONE]", "blue", "complete - all product price update");
};

// updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
updateByProductId();

export { getAllProductIdType };
// product_id = 67081
// keyword_id = 365228494
