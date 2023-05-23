import axios, { AxiosError } from "axios";
import { NODE_API_URL } from "./common";
import { l } from "./console";
import { getCoupangStoreData } from "./coupang/getCoupangStoreData";
import { getProductByNaverCatalogV2 } from "./getProductByNaverCatalogV2";
import { getAllProductIdType } from "./product_price_update";
import { getProductPriceData } from "./updateByIherb";
import { StoreType } from "./updateByItemscout";
import { getProductByItemscoutV2 } from "./updateByItemscoutV2";

export const setGraph = async (product: getAllProductIdType) => {
  try {
    await axios.post(`${NODE_API_URL}/v2/product/daily_price/history`, {
      product_id: product.product_id,
    });
    l("Sub", "blue", "complete - product_price write history");
  } catch (error) {
    l("Sub Err", "red", "failed - product_price write history");
  }
};

export const setLastMonthLowPrice = async (product: getAllProductIdType) => {
  try {
    await axios.patch(`${NODE_API_URL}/product/price/low_price`, {
      product_id: product.product_id,
    });
    l("Sub", "blue", "complete - low price of month was written");
  } catch (error) {
    l("Sub Err", "red", "failed - low price of month was written");
  }
};
export const shuffle = (array: getAllProductIdType[]) => {
  array.sort(() => Math.random() - 0.5);
};

export const exceptionCompanyListAtNaver = () =>
  axios.get(`${NODE_API_URL}/crawling/blacklist`).then((res) => res.data.data);

export const getNotificationItemscoutList = () => {
  return axios
    .get(`${NODE_API_URL}/crawling/product/notification/itemscout`)
    .then((res) => res.data.data.map((item: { product_id: string }) => item.product_id))
    .catch((error) => {
      l("[Notification Itemscout error]", "yellow");
      return [];
    });
};

export const getHolyZoneId = (): Promise<number[]> =>
  axios(`${NODE_API_URL}/crawling/product/holyzone/all`)
    .then((d) => {
      const data: { product_id: number; product_name: string }[] = d.data.data;
      return data.map((p) => p.product_id);
    })
    .catch((e) => {
      l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/all" + e.code);
      return [];
    });

export const getStoreList = async (product: getAllProductIdType) => {
  try {
    const crawlingType = product.type;
    if (crawlingType === "itemscout") {
      const [coupangStoreList, iherbStoreData, itemscoutStoreList] = await Promise.all([
        getCoupangStoreData(product),
        getProductPriceData(product),
        getProductByItemscoutV2(product),
      ]);
      if (iherbStoreData) return [...coupangStoreList, iherbStoreData, ...itemscoutStoreList];
      return [...coupangStoreList, ...itemscoutStoreList];
    }

    if (crawlingType === "naver") {
      const [coupangStoreList, naverStoreList] = await Promise.all([
        getCoupangStoreData(product),
        getProductByNaverCatalogV2(product),
      ]);
      return [...coupangStoreList, ...naverStoreList];
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const setStoreList = async (product: getAllProductIdType, storeList: StoreType[]) => {
  const dataToSend = {
    product,
    store_list: storeList,
  };

  const data: boolean = await axios
    .post(`${NODE_API_URL}/v2/crawling/store`, dataToSend)
    .then((res) => {
      if (res.data.message) l(`PASS MESSAGE product_id: ${product.product_id}`, "green", res.data.message);
      return res.data.data;
    })
    .catch(() => {
      l("Err ", "red", `setStoreList ${NODE_API_URL}/v2/crawling/store` + JSON.stringify(dataToSend));
      return null;
    });
  return data;
};
