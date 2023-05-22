import axios from "axios";
import { getAllProductIdType } from "./product_price_update";
import { NODE_API_URL } from "./common";
import { l } from "./console";
import { getCoupangStoreData } from "./coupang/getCoupangStoreData";
import { getProductPriceData } from "./updateByIherb";
import { getProductByItemscoutV2 } from "./updateByItemscoutV2";
import { getProductByNaverCatalogV2 } from "./getProductByNaverCatalogV2";

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
    .then((res) =>
      res.data.data.map((item: { product_id: string }) => item.product_id)
    )
    .catch((error) => {
      l("[Notification Itemscout error]", "yellow");
      return [];
    });
};
/** 아이템스카우트 스크래핑 할 때 오든 판매처 정보 가지고 오기 */
export const getAllDataByItemscout = async (product: getAllProductIdType) => {
  const [coupangStoreList, iherbStoreData, itemscoutData] = await Promise.all([
    getCoupangStoreData(product),
    getProductPriceData(product),
    getProductByItemscoutV2(product),
  ]);

  return {
    coupang_list: coupangStoreList,
    iherb_data: iherbStoreData,
    itemscout_list: itemscoutData.productListResult,
    keyword: itemscoutData.keyword,
    keyword_id: itemscoutData.keyword_id,
  };
};

export const getAllDataByNaver = async (product: getAllProductIdType) => {
  const [] = await Promise.all([
    getCoupangStoreData(product),
    getProductByNaverCatalogV2(product),
  ]);

  return {};
};
