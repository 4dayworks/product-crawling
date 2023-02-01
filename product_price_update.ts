import axios from "axios";
import { l } from "./console";
import { getProductByNaverCatalog } from "./product_price_update.module";
// 1. 야기야기 product_price 데이터 가져오기
// 1-1. 네이버카탈로그 url 데이터가져오기

const updateByNaverCatalogByPage = async (size: number, page: number) => {
  const d: {
    product_id: number; //34074;
    naver_catalog_link: string; //"https://msearch.shopping.naver.com/catalog/15282323215";
  }[] = await axios(`https://node3.yagiyagi.kr/product/catalog/url?size=${size}&page=${page}`).then((d) => d.data.data);

  for (let i = 0; i < d.length; i++) {
    const { product_id, naver_catalog_link } = d[i];
    await getProductByNaverCatalog(product_id, naver_catalog_link);
  }

  l("[DONE]", "blue", "naver_catalog_link to product price");
};
updateByNaverCatalogByPage(10, 0);

// 1-2. 아이템스카우트 keyword 데이터가져오기

// 2. 네이버카탈로그 갱신
// product_price_catalog_link -> product_price_catalog_data

// 3. 아이템스카우트 기준 갱신
// product_price_itemscout_keyword -> product_price_itemscout_datau
