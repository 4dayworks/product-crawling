import axios from "axios";
import { getAllProductIdType } from "../product_price_update.d";
import { NODE_API_URL } from "./common";
import { l } from "./console";

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

export const exceptionCompanyListAtNaver = [
  "템스윈공식몰",
  "위메프",
  "여노마뚜",
  "라온팜",
  "정품 H컴퍼니몰",
  "YSK홀딩스",
  "위니딧",
  "라 ON",
  "프리모리빙",
  "오굿데이",
  "힐스 마켓",
  "식물영양소",
];

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
