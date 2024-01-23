import axios from "axios";
import { StoreType } from "../types/craw";
import { writeLog } from "../writeLog";
import { UpdateByProductIdType } from "./UpdateByProductIdType";
import { getCoupangStoreList } from "./getCoupangStoreList";
import { getItemscoutStoreList } from "./getItemscoutStoreList";
import { ProductType } from "./getProductIdList";
import { NODE_API_URL_CAMP } from "../../function/common";
import { l } from "../../function/console";

export const getStoreList = async (
  product: ProductType,
  processName: string,
  bot_id: number,
  proxyIP: string,
  type: UpdateByProductIdType["type"]
) => {
  try {
    if (type === "all") {
      const [coupangStoreList, itemscoutStoreList] = await Promise.all([
        getCoupangStoreList(product, bot_id, proxyIP),
        getItemscoutStoreList(product, bot_id, proxyIP),
      ]);
      const message = `itemscout: ${itemscoutStoreList.length} 개 판매처, coupang: ${coupangStoreList.length} 개 판매처를 불러왔습니다.`;
      l("[필터링전]", "white", message);
      return coupangStoreList.concat(itemscoutStoreList);
    }
    if (type === "only-itemscout-naver") {
      const itemscoutStoreList = await getItemscoutStoreList(product, bot_id, proxyIP);
      const message = `itemscout: ${itemscoutStoreList.length} 개 판매처, coupang: 0 개 판매처를 불러왔습니다.`;
      l("[필터링전]", "white", message);
      return itemscoutStoreList;
    }
  } catch (error) {
    writeLog(processName, `[ERROR] getStoreList ${(error as Error).message}`);
    l("Err", "red", "getStoreList " + (error as Error).message);
    return null;
  }
};

export const setStoreList = async (product: ProductType, store_list: StoreType[]) => {
  const data: boolean = await axios
    .post(`${NODE_API_URL_CAMP}/crawling/store`, { product, store_list })
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
