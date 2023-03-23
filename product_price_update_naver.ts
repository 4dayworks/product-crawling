import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import { getProductByNaverCatalogV2 } from "./function/getProductByNaverCatalogV2";
import { wrapSlept } from "./function/wrapSlept";
import { getAllProductIdType } from "./product_price_update.d";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateByProductId = async (product_id_list?: number[]) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let data: getAllProductIdType[] = await axios(`${NODE_API_URL}/crawling/product/all`).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) data = data.filter((p) => product_id_list.includes(p.product_id));

  for (let i = 0; i < data.length; i++) {
    const product = data[i];

    // if (product.type === "itemscout") {
    //   await getProductByItemscoutV2(product, i + 1, data.length);
    //   await wrapSlept(300);
    // } else
    if (product.type === "naver" && product.naver_catalog_link) {
      await getProductByNaverCatalogV2(product, i + 1, data.length);
      await wrapSlept(2000);
    }
    l("timestamp", "cyan", new Date().toISOString());
  }
  l("[DONE]", "blue", "complete - all product price update");
};

// updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateByProductId(Array.from({ length: 100 }).map((a, i) => i + 1));
updateByProductId();
