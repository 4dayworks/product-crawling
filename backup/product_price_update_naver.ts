// import axios from "axios";
// import { AuthorizationKey } from "./function/auth";
// import { NODE_API_URL } from "./function/common";
// import { l } from "./function/console";
// import { getProductByNaverCatalogV2 } from "./function/getProductByNaverCatalogV2";
// import { wrapSlept } from "./function/wrapSlept";
// import { getAllProductIdType } from "./function/product_price_update";
// import { setGraph, setLastMonthLowPrice, shuffle } from "./function/product";
// import { getCoupangStoreData } from "./function/coupang/getCoupangStoreData";

// axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// const updateByProductId = async (product_id_list?: number[]) => {
//   // (1) 키워드 가져올 제품아이디 전체 가져오기
//   let data: getAllProductIdType[] = await axios(
//     `${NODE_API_URL}/v4/crawling/product/all?page=0&size=100000`
//   ).then((d) => d.data.data);
//   // 특정 제품만 가져오기 (없으면 전체 제품 대상)
//   if (product_id_list)
//     data = data.filter((p) => product_id_list.includes(p.product_id));

//   //#region (2) 성지가격있는 제품아이디 모두 제외시키기
//   const exceptionList: number[] = await axios(
//     `${NODE_API_URL}/crawling/product/holyzone/all`
//   )
//     .then((d) => {
//       const data: { product_id: number; product_name: string }[] = d.data.data;
//       return data.map((p) => p.product_id);
//     })
//     .catch((e) => {
//       l(
//         "Noti Err",
//         "red",
//         "성지존 알림 오류 /crawling/product/holyzone/all" + e.code
//       );
//       return [];
//     });
//   data = data.filter((p) => !exceptionList.includes(p.product_id));
//   shuffle(data);
//   //#endregion

//   for (let i = 0; i < data.length; i++) {
//     const product = data[i];
//     const coupangStoreList = await getCoupangStoreData(product);

//     if (product.type === "naver" && product.naver_catalog_link) {
//       await getProductByNaverCatalogV2(
//         product,
//         i + 1,
//         data.length,
//         coupangStoreList
//       );
//       await wrapSlept(2000);
//       await setGraph(product);
//       await setLastMonthLowPrice(product);
//     }
//     l("timestamp", "blue", new Date().toISOString());
//   }
//   l("[DONE]", "blue", "complete - all product price update");
// };

// // updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// // updateByProductId(Array.from({ length: 100 }).map((a, i) => i + 1));
// updateByProductId();
