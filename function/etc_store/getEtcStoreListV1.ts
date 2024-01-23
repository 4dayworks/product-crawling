import axios from "axios";
import { getProductTypeV6 } from "../../legacy/all_update";
import { NODE_API_URL_YAGI } from "../common";
import { l } from "../console";
import { StoreTypeV5 } from "../updateByItemscout";
import { AuthorizationKey } from "../auth";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;
type ResType = {
  yagi_keyword: null;
  origin_product_name: string;
  product_image: string;
  mall_image: string;
  price: number;
  delivery: number;
  store_name: string;
  category: null;
  review_count: number;
  review_score: number;
  is_naver_shop: 0 | 1;
  is_oversea: 0 | 1;
  store_link: string;
};

export const getEtcStoreListV1 = (product: getProductTypeV6) => {
  return new Promise<StoreTypeV5[]>(async (resolve, reject) => {
    const { product_id } = product;
    try {
      const data = await axios
        .get<{ data: ResType[] }>(`${NODE_API_URL_YAGI}/crawling/product/etc_store/list?product_id=${product_id}`)
        .then((d) => {
          const data = d.data.data;
          return data.map((store) => ({
            ...store,
            is_naver_shop: store.is_naver_shop === 1,
            is_oversea: store.is_oversea === 1,
          }));
        });
      resolve(data);
    } catch (error) {
      l("ERR", "red", `getEtcStoreListV1 product_id:${product_id.toString().padStart(5)}`);
      reject(new Error("getEtcStoreListV1 Error"));
    }
  });
};
