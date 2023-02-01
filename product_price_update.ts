import axios from "axios";
import { l } from "./function/console";
import { getProductByNaverCatalog } from "./function/getProductByNaverCatalog";

// 1. 네이버카탈로그 url 데이터가져오기 & 야기 DB procude_price에 반영
const updateByNaverCatalog = async (size: number, page: number) => {
  const d: {
    product_id: number; //34074;
    naver_catalog_link: string; //"https://msearch.shopping.naver.com/catalog/15282323215";
  }[] = await axios(`https://node3.yagiyagi.kr/product/catalog/url?size=${size}&page=${page}`).then((d) => d.data.data);

  for (let i = 0; i < d.length; i++) {
    const { product_id, naver_catalog_link } = d[i];
    await getProductByNaverCatalog(product_id, naver_catalog_link, i + 1, d.length);
  }

  l("[DONE]", "blue", "naver_catalog_link to product price");
};
// updateByNaverCatalog(10000, 0);

const getProductByItemscout = (product_id: number, product_name: string, index: number, max: number) =>
  new Promise(async (resolve, reject) => {
    // (2) 키워드 가져오기
    // GET /product/keyword/id
    const d: {
      keyword: string; // '그린스토어 피로한눈엔 루테인 아스타잔틴오메가3',
      keyword_id: number; // 349123387,
      exception_keyword: string | null;
    } | null = await axios(`https://node3.yagiyagi.kr/product/keyword/id?product_id=${30 + index}`).then(
      (d) => d.data.data
    );
    if (d === null) {
      // (2-1). 아예 없으면 키워드 제품명으로해서 itemscout REST API 써서 keyword_id가져오고 insert하기
      // POST /product/keyword/id
      const url = `https://api.itemscout.io/api/keyword`;
      const headers = { "Accept-Encoding": "deflate, br" };
      const itemscout_keyword_id = await axios
        .post(url, { keyword: product_name }, { headers })
        .then((d) => d.data.data);

      await axios
        .post(`https://node3.yagiyagi.kr/product/product/keyword/id`, {
          keyword: product_name,
          keyword_id: itemscout_keyword_id,
          yagi_product_id: product_id,
        })
        .then((d) => d.data.data);
    } else {
      // (2-2). keyword_id 만 없으면 itemscout REST API 써서 keyword_id가져오고 update하기
      // PATCH /product/keyword/id
    }

    resolve(true);
  });

// 2. 아이템스카우트 데이터가져오기 & 야기 DB procude_price에 반영
// 네이버카탈로그 url 있으면 안가져오고 넘김.
const updateByItemscout = async (size: number, page: number) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  // GET /product/keyword
  const d: {
    product_id: number; //34074;
    product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
  }[] = await axios(`https://node3.yagiyagi.kr/product/keyword?size=${size}&page=${page}`).then((d) => d.data.data);

  for (let i = 0; i < 3; i++) {
    //d.length
    const { product_id, product_name } = d[i];
    await getProductByItemscout(product_id, product_name, i + 1, d.length);
  }

  l("[DONE]", "blue", "itemscout_keyword to product price");
};

updateByItemscout(100, 0);

// (3) itemscout에서 keyword_id 로 검색해서 집어넣기
// POST /product/keyword/data

// (4) product_price 최저가로 업데이트하기
// POST /product/price
