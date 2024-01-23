import axios from "axios";
import { getProductTypeV6, updateByProductIdType } from "../legacy/all_update";
import { NODE_API_URL_YAGI } from "./common";
import { l } from "./console";
import { getCoupangStoreListV5 } from "./coupang/getCoupangStoreListV5";
import { getIherbStoreListV5 } from "./iherb/getIherbStoreListV5";
import { getItemscoutStoreListV5 } from "./itemscout/getItemscoutStoreListV5";
import { getNaverCatalogStoreListV5 } from "./naver/getNaverCatalogStoreListV5";
import { StoreTypeV5 } from "./updateByItemscout";
import { getEtcStoreListV1 } from "./etc_store/getEtcStoreListV1";

// export const setGraph = async (product: getAllProductIdType) => {
//   try {
//     await axios.post(`${NODE_API_URL}/v2/product/daily_price/history`, {
//       product_id: product.product_id,
//     });
//     // l("Sub", "blue", "complete - product_price write history");
//   } catch (error) {
//     l("Sub Err", "red", "failed - product_price write history");
//   }
// };
export const setGraphV5 = async (product: getProductTypeV6) => {
  try {
    await axios.post(`${NODE_API_URL_YAGI}/v2/product/daily_price/history`, {
      product_id: product.product_id,
    });
    // l("Sub", "blue", "complete - product_price write history");
  } catch (error) {
    l("Sub Err", "red", "failed - product_price write history");
  }
};

// export const setLastMonthLowPrice = async (product: getAllProductIdType) => {
//   try {
//     await axios.patch(`${NODE_API_URL}/product/price/low_price`, {
//       product_id: product.product_id,
//     });
//     // l("Sub", "blue", "complete - low price of month was written");
//   } catch (error) {
//     l("Sub Err", "red", "failed - low price of month was written");
//   }
// };
export const setLastMonthLowPriceV5 = async (product: getProductTypeV6) => {
  try {
    await axios.patch(`${NODE_API_URL_YAGI}/product/price/low_price`, {
      product_id: product.product_id,
    });
    // l("Sub", "blue", "complete - low price of month was written");
  } catch (error) {
    l("Sub Err", "red", "failed - low price of month was written");
  }
};

export const exceptionCompanyListAtNaver = () =>
  axios.get(`${NODE_API_URL_YAGI}/crawling/blacklist`).then((res) => res.data.data);

// export const getNotificationItemscoutList = () => {
//   return axios
//     .get(`${NODE_API_URL}/crawling/product/notification/itemscout`)
//     .then((res) => res.data.data.map((item: { product_id: string }) => item.product_id))
//     .catch((error) => {
//       l("[Notification Itemscout error]", "yellow");
//       return [];
//     });
// };

// export const getHolyZoneId = (): Promise<number[]> =>
//   axios(`${NODE_API_URL}/crawling/product/holyzone/all`)
//     .then((d) => {
//       const data: { product_id: number; product_name: string }[] = d.data.data;
//       return data.map((p) => p.product_id);
//     })
//     .catch((e) => {
//       l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/all" + e.code);
//       return [];
//     });

export const getStoreListV5 = async (product: getProductTypeV6) => {
  try {
    const [coupangStoreList, iherbStoreData, itemscoutStoreList, naverStoreList, etcStoreList] = await Promise.all([
      getCoupangStoreListV5(product),
      getIherbStoreListV5(product),
      getItemscoutStoreListV5(product),
      getNaverCatalogStoreListV5(product),
      getEtcStoreListV1(product),
    ]);
    return coupangStoreList.concat(
      iherbStoreData,
      naverStoreList.length > 0
        ? itemscoutStoreList.filter((i) => !i.store_name?.includes("판매처 "))
        : itemscoutStoreList,
      naverStoreList,
      etcStoreList // <- 주석풀면 떠리몰 가능
    );
  } catch (error) {
    l("Err", "red", "getStoreListV6 " + (error as Error).message);
    return null;
  }
};

export const setStoreListV6 = async (
  product: getProductTypeV6,
  store_list: StoreTypeV5[],
  type: updateByProductIdType["type"]
) => {
  const dataToSend = { product, store_list, type };

  const data: boolean = await axios
    .post(`${NODE_API_URL_YAGI}/v6/crawling/store`, dataToSend)
    .then((res) => {
      if (res.data.message) l(`No Store`, "magenta", `MESSAGE product_id: ${product.product_id} ${res.data.message}`);
      return res.data.data;
    })
    .catch((e) => {
      l("Err ", "red", `setStoreList ${NODE_API_URL_YAGI}/v6/crawling/store`);
      return null;
    });
  return data;
};
