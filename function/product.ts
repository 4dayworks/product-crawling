import axios from "axios";
import { getAllProductIdType } from "./product_price_update";
import { NODE_API_URL, toComma } from "./common";
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

export const getHolyZoneId = (): Promise<number[]> =>
  axios(`${NODE_API_URL}/crawling/product/holyzone/all`)
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

export const getStoreList = async (product: getAllProductIdType) => {
  if (product.type === "itemscout") {
  }

  if (product.type === "naver") {
  }
};
/** 제품 최저가 갱신시 유저에게 알림 보내기 */
// export const setNotification = async () => {
//   if (data.low_price && data.low_price > 100) {
//     const notiList = await axios
//       .post(`${NODE_API_URL}/crawling/product/notification`, {
//         low_price: data.low_price,
//         product_id: data.product_id,
//       })
//       .then((d) =>
//         d.data.data && d.data.data.length > 0
//           ? (d.data.data as {
//               user_id: number;
//               is_lowest: 0 | 1;
//               low_price: number;
//             }[])
//           : null
//       )
//       .catch((e) =>
//         l(
//           "Noti Err",
//           "red",
//           "최저가 알림 오류 /crawling/product/notification " + e.code
//         )
//       );

//     const userList = notiList ? notiList.map((i) => i.user_id).join(",") : null;
//     if (notiList && userList && userList.length > 0) {
//       const prevPriceList = notiList.filter((i) => i);
//       const prevPrice =
//         prevPriceList.length > 0 ? prevPriceList[0].low_price : null;
//       const prevPriceText = prevPrice ? `${toComma(prevPrice)}원에서 ` : "";
//       const nextPrice = toComma(data.low_price);
//       const subText = notiList[0].is_lowest === 1 ? ` (⚡역대최저가)` : "";
//       const message = `내가 관심을 보인 ${originData.product_name} 가격이 ${prevPriceText}${nextPrice}원으로 내려갔어요⬇️${subText}`;
//       await axios
//         .get(
//           `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=${message}&link=/product/${originData.product_id}`
//         )
//         .catch((e) =>
//           l(
//             "Noti Err",
//             "red",
//             "최저가 알림 오류 /user/firebase/send/low_price " + e.code
//           )
//         );
//     }
//   }
// };

export const setLowPrice = async () => {};

/** 아이템스카우트 스크래핑 할 때 모든 판매처 정보 가지고 오기 */
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
/** 네이버 스크래핑 할 때 모든 판매처 정보 가지고 오기 */
export const getAllDataByNaver = async (
  product: getAllProductIdType,
  index: number,
  max: number
) => {
  const [coupangStoreList, naverStoreData] = await Promise.all([
    getCoupangStoreData(product),
    getProductByNaverCatalogV2(product, index, max),
  ]);

  return {
    coupangStoreList,
    naverStoreList: naverStoreData.naverStoreList,
    reviewCount: naverStoreData.reviewCount,
    dataList: naverStoreData.dataList,
  };
};
