// import axios from "axios";
// import cheerio from "cheerio";
// import { uniqueId } from "lodash";
// import { getProductTypeV6 } from "../../all_update";
// import { l } from "../console";
// import { StoreTypeV5 } from "../updateByItemscout";

// // 아이템스카우트 쿠팡에서 가져오기
// export const getCoupangStoreListV6 = async ({ coupang_keyword }: getProductTypeV6) => {
//   // const getHeaders = () => {
//     return {
//       Accept: "*/*",
//       "Accept-Encoding": "deflate, br",
//       "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
//       "User-Agent":
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
//       Cookie: uniqueId(),
//       "Postman-Token": "2360597e-8d8b-45a2-aa5a-c76ea406ef7d",
//       Host: "www.coupang.com",
//       Connection: "keep-alive",
//     };
//   };
//   // 1. 쿠팡 키워드 없을 경우 쿠팡 데이터를 가져오지 않음.
//   if (!coupang_keyword) {
//     l("INFO", "green", "no coupang keyword <- 판매처 가져오지 않음");
//     return [];
//   }

//   // 2. 쿠팡 검색 결과 페이지 크롤링하기
//   // .replace(    /[ \[\]]/g,    "+"  )
//   const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(
//     coupang_keyword
//   )}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=rocket_luxury%2Crocket%2Ccoupang_global&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=719&component=&rating=0&sorter=scoreDesc&listSize=36`;

//   const response = await axios.post(url).catch((e) => {
//     l("Err", "red", "getCoupangStoreDataV5" + e);
//     throw Error("Coupang Search Result Page Crawling Error");
//   });

//   // const response = await axios.get(url, { headers: getHeaders() }).catch((e) => {
//   //   l("Err", "red", "getCoupangStoreDataV5" + e);
//   //   throw Error("Coupang Search Result Page Crawling Error");
//   // });

//   // const $ = cheerio.load(response.data);
//   const storeList: StoreTypeV5[] = [];
//   // 3. 판매처 정보 가져와서 광고 제품 필터링하기

//   //   // 4. 판매처 list에 모으기
//   //   if (!type || is_ad || !store_product_image || outOfStock === "일시품절") return;
//   //   const data: StoreTypeV5 = {
//   //     yagi_keyword: coupang_keyword,
//   //     origin_product_name: store_product_name,
//   //     product_image: store_product_image,
//   //     mall_image: null,
//   //     price: store_price,
//   //     delivery: 0,
//   //     store_name: type,
//   //     category: null,
//   //     review_count: store_review_count,
//   //     review_score: store_review_score,
//   //     is_naver_shop: false,
//   //     is_oversea: type === "로켓직구",
//   //     store_link,
//   //   };
//   //   storeList.push(data);
//   // });

//   return storeList;
// };

// type CoupangDataType = {
//   coupang_require_keyword_list: string | null;
//   coupang_exception_keyword_list: string | null;
// };
