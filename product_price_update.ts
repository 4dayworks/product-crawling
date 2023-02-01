import axios from "axios";
import { l } from "./function/console";
import { getProductByNaverCatalog } from "./function/getProductByNaverCatalog";

// 1. 야기야기 product_price 데이터 가져오기
// 1-1. 네이버카탈로그 url 데이터가져오기 & 야기 DB procude_price에 반영
const updateByNaverCatalogByPage = async (size: number, page: number) => {
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
updateByNaverCatalogByPage(10000, 0);

// -- 1. 키워드 가져올 제품아이디 전체 가져오기

// -- 2. 키워드 가져오기

// -- 2-1. 아예 없으면 키워드 제품명으로해서 itemscout REST API 써서 keyword_id가져오고 insert하기

// -- 2-2. keyword_id 만 없으면 itemscout REST API 써서 keyword_id가져오고 update하기

// -- 3. itemscout에서 keyword_id 로 검색해서 집어넣기

// -- 4. product_price 최저가로 업데이트하기
