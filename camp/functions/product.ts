import axios from "axios";
import { StoreType } from "../types/craw";
import { writeLog } from "../writeLog";
import { UpdateByProductIdType } from "./UpdateByProductIdType";
import { getCoupangStoreList } from "./getCoupangStoreList";
import { ProductType } from "./getProductIdList";
import { NODE_API_URL_CAMP } from "../../function/common";
import { l } from "../../function/console";
import getNatverStoreList from "../../function/naver/getNaverStoreList";

export const getStoreList = async (
  product: ProductType,
  processName: string,
  bot_id: number,
  proxyIP: string,
  type: UpdateByProductIdType["type"]
) => {
  try {
    if (type === "all") {
      const [coupangStoreList, naverStoreList] = await Promise.all([
        getCoupangStoreList(product, bot_id, proxyIP),
        getNatverStoreList({ keyword: product.itemscout_keyword }),
      ]);
      const message = `naver: ${naverStoreList.length} 개 판매처, coupang: ${coupangStoreList.length} 개 판매처를 불러왔습니다.`;
      l("[필터링전]", "white", message);
      return coupangStoreList.concat(naverStoreList);
    }
    if (type === "only-itemscout-naver") {
      const naverStoreList = await getNatverStoreList({ keyword: product.itemscout_keyword });
      const message = `naver: ${naverStoreList.length} 개 판매처, coupang: 0 개 판매처를 불러왔습니다.`;
      l("[필터링전]", "white", message);
      return naverStoreList;
    }
  } catch (error) {
    writeLog(processName, `[ERROR] getStoreList ${(error as Error).message}`);
    l("Err", "red", "getStoreList " + (error as Error).message);
    return null;
  }
};

export const setStoreList = async (
  product: ProductType,
  store_list: StoreType[],
  type: UpdateByProductIdType["type"]
) => {
  const data: boolean = await axios
    .post(`${NODE_API_URL_CAMP}/crawling/store`, { product, store_list, type })
    .then((res) => {
      if (res.data.message) l(`No Store`, "magenta", `MESSAGE product_id: ${product.product_id} ${res.data.message}`);

      return res.data.data;
    })
    .catch((error) => {
      l(`setStoreList Err`, "magenta", `MESSAGE product_id: ${product.product_id} ${error}`);
      console.log(error);
      return null;
    });

  return data;
};
