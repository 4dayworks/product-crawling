// import { AxiosError, AxiosResponse } from "axios";
// import axios from "axios";
// import { exceptCategory } from "./function/itemscout/index";

// const execute = async () => {
//   const a = await axios
//     .get(`https://openapi.naver.com/v1/search/shop.json`, {
//       params: { query: "잘크톤", display: 100, sort: "sim", exclude: "used" },
//       headers: { "X-Naver-Client-Id": "yeoXdUtxPpcjkxR4G932", "X-Naver-Client-Secret": "TChrYL1rxH" },
//     })
//     .then((d: AxiosResponse) => getListFiltered(d.data))
//     .catch((e: AxiosError) => console.error("err", e.message));

// };

// execute();

// const getListFiltered = (data: NaverApiType) => {
//   const res = data as NaverApiType;

//   return res.items.filter((i) => {
//     const categoryList: string[] = [];
//     if (i.category1) categoryList.push(i.category1);
//     if (i.category2) categoryList.push(i.category2);
//     if (i.category3) categoryList.push(i.category3);
//     if (i.category4) categoryList.push(i.category4);
//     return Number(i.lprice) > 100 && Number(i.productType) < 4 && exceptCategory(categoryList.join(">"));
//   });
// };

// type NaverApiType = {
//   lastBuildDate: string; //"Wed, 24 May 2023 18:41:29 +0900";
//   total: number; //3851;
//   start: number; //1;
//   display: number; //3;
//   items: {
//     title: string; // "<b>잘큰톤</b>쑥쑥 어린이 키즈 유산균 프로바이오틱스 30포 10555946";
//     link: string; // "https://search.shopping.naver.com/gate.nhn?id=32724727041";
//     image: string; // "https://shopping-phinf.pstatic.net/main_3272472/32724727041.jpg";
//     lprice: string; // "33650";
//     hprice: string; // "";
//     mallName: string; // "위메프";
//     productType: string; // "2";
//     productId: string; // "32724727041";
//     brand: string; // "조아제약";
//     maker: string; // "알피바이오";
//     category1: string; // "식품";
//     category2: string; // "건강식품";
//     category3: string; // "영양제";
//     category4: string; // "기타건강보조식품";
//   }[];
// };
