// import axios from "axios";
// import { AuthorizationKey } from "./function/auth";
// import { l } from "./function/console";
// import { getProductByItemscout } from "./function/updateByItemscout";
// import { getProductByNaverCatalog } from "./backup/updateByNaverCatalog";
// import { wrapSlept } from "./function/wrapSlept";
// axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// const updateByItemscout = async (product_id_list: number[]) => {
//   // (1) 키워드 가져올 제품아이디 전체 가져오기
//   // GET /product/keyword
//   const d1: {
//     product_id: number; //34074;
//     product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
//   }[] = await axios(`https://node2.yagiyagi.kr/product/keyword?size=30000&page=0&is_expert_review=0`).then(
//     (d) => d.data.data
//   );
//   const d2: {
//     product_id: number; //34074;
//     product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
//   }[] = await axios(`https://node2.yagiyagi.kr/product/keyword?size=30000&page=0&is_expert_review=1`).then(
//     (d) => d.data.data
//   );
//   const list = [...d1, ...d2];
//   for (let i = 0; i < list.length; i++) {
//     const { product_id, product_name } = list[i];
//     if (product_id_list.includes(product_id)) {
//       l("timestamp", "cyan", new Date().toISOString());
//       await getProductByItemscout(product_id, product_name, i + 1, list.length);
//     }
//   }

//   l("[DONE]", "blue", "itemscout_keyword to product price");

//   const d: {
//     product_id: number; //34074;
//     naver_catalog_link: string; //"https://msearch.shopping.naver.com/catalog/15282323215";
//   }[] = await axios(`https://node2.yagiyagi.kr/product/catalog/url?size=${100000}&page=${0}`).then((d) => d.data.data);

//   for (let i = 0; i < d.length; i++) {
//     const { product_id, naver_catalog_link } = d[i];
//     if (product_id_list.includes(product_id)) {
//       l("timestamp", "cyan", new Date().toISOString());
//       await getProductByNaverCatalog(product_id, naver_catalog_link, i + 1, d.length);
//       await wrapSlept(3000);
//     }
//   }

//   l("[DONE]", "blue", "naver_catalog_link to product price");
// };

// updateByItemscout([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
