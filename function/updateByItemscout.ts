import {
  ProductTable,
  ItemscoutType,
  ProductTableV2,
} from "./updateByItemscout.d";
import axios from "axios";
import { l } from "./console";


/** 건강식품 카테고리는 아니지만, 효과는 건강식품인 카테고리 */
const acceptCategoryObj: {
  [key: string]: boolean;
} = {
  "식품>다이어트식품>가르시니아": true,
  "식품>다이어트식품>기타다이어트식품": true,
  "식품>다이어트식품>단백질보충제": true,
  "식품>다이어트식품>단백질보충제>단백질파우더": true,
  "식품>다이어트식품>식이섬유": true,
  "식품>다이어트식품>다이어트바": true,
  "식품>다이어트식품>콜라겐":true,
  "식품>다이어트식품": true
};

/** 건강식품 중에서 받으면 안되는 것 */
const exceptCategoryObj: {
  [key: string]: boolean;
} = {
  "식품>건강식품>환자식/영양보충식": true,
  "식품>건강식품>건강즙/과일즙": true,
  "식품>건강식품>한방재료": true,
};

/** 제외해야할 category를 필터링 해주는 함수입니다. 
 * 순서는 무조건 아래의 if문으로 사용해야합니다.
 * 건강식품 카테고리가 아닌 상품에 대해서 먼저 처리해야하기 때문에 순서가 중요합니다.
*/
const exceptCategory = (category: string) => {
  const categoryData = String(category).split(">");

  if (categoryData[0] !== "식품") return false;

  if (acceptCategoryObj[category]) return true;

  if (exceptCategoryObj[category]) return false;

  if(categoryData[1] !== "건강식품") return false;

  return true;
};
export const getProductByItemscout = (
  product_id: number,
  product_name: string,
  index: number,
  max: number
) =>
  new Promise(async (resolve, reject) => {
    try {
      //#region product/is_drugstore = 1 이거나 product_price/is_manual = 1이면 새로 갱신 안함.
      const manualData:
        | {
            product_id: string | null;
            is_drugstore: number | null;
            low_price: number | null;
            delivery: number | null;
            store_name: string | null;
            store_link: string | null;
            regular_price: number | null;
            is_manual: number | null;
          }
        | undefined = await axios(
        `https://node2.yagiyagi.kr/product/price/manual?product_id=${product_id}`
      ).then((d) => d.data.data);
      if (
        manualData &&
        (manualData.is_drugstore === 1 || manualData.is_manual === 1)
      ) {
        if (manualData.is_drugstore === 1)
          l(
            "Pass",
            "green",
            `[${index}/${max}] is_drugstore === 1, product_id:${product_id}`
          );
        else if (manualData.is_manual === 1)
          l(
            "Pass",
            "green",
            `[${index}/${max}] is_manual === 1, product_id:${product_id}`
          );
        return resolve(true);
      }
      //#endregion
      //#region (2) 키워드 가져오기 & 있는지 확인하고 야기 DB에 반영하기
      // GET /product/keyword/id
      const originData: {
        keyword: string; // '그린스토어 피로한눈엔 루테인 아스타잔틴오메가3',
        keyword_id: number | null; // 349123387,
        exception_keyword: string | null;
        require_keyword: string | null;
      } | null = await axios(
        `https://node2.yagiyagi.kr/product/keyword/id?product_id=${product_id}`
      ).then((d) => d.data.data);
      let keyword_id =
        originData && originData.keyword_id ? originData.keyword_id : null;
      let keyword =
        originData && originData.keyword ? originData.keyword : null;
      if (originData === null) {
        // (2-2). 아예 없으면 키워드 제품명으로해서 itemscout REST API 써서 keyword_id가져오고 insert하기
        // POST /product/keyword/id
        const url = `https://api.itemscout.io/api/keyword`;
        const headers = { "Accept-Encoding": "deflate, br" };
        const itemscout_keyword_id = await axios
          .post(url, { keyword: product_name }, { headers })
          .then((d) => d.data.data);
        // 야기DB에 저장
        keyword_id = itemscout_keyword_id;
        keyword = product_name;
        await axios.post(`https://node2.yagiyagi.kr/product/keyword/id`, {
          keyword: product_name,
          keyword_id: itemscout_keyword_id,
          yagi_product_id: product_id,
        });
      } else if (originData.keyword && originData.keyword_id === null) {
        //  (2-1). keyword가 있고 keyword_id가 없으면 해당 키워드로 검색하고 keyword_id update하기
        const url = `https://api.itemscout.io/api/keyword`;
        const headers = { "Accept-Encoding": "deflate, br" };
        const itemscout_keyword_id = await axios
          .post(url, { keyword: originData.keyword }, { headers })
          .then((d) => d.data.data);
        keyword_id = itemscout_keyword_id;
        keyword = originData.keyword;
        // 야기DB keyword, keyword_id 업데이트
        await axios.patch(`https://node2.yagiyagi.kr/product/keyword/id`, {
          keyword: originData.keyword,
          keyword_id: itemscout_keyword_id,
          yagi_product_id: product_id,
        });
      } else if (originData.keyword_id === null) {
        // (2-3). keyword_id 만 없으면 해당 제품명으로 검색하고 keyword_id가져오고 update하기
        // PATCH /product/keyword/id
        const url = `https://api.itemscout.io/api/keyword`;
        const headers = { "Accept-Encoding": "deflate, br" };
        const itemscout_keyword_id = await axios
          .post(url, { keyword: product_name }, { headers })
          .then((d) => d.data.data);
        // 야기DB keyword_id 업데이트
        keyword_id = itemscout_keyword_id;
        keyword = product_name;
        await axios.patch(`https://node2.yagiyagi.kr/product/keyword/id`, {
          keyword: product_name,
          keyword_id: itemscout_keyword_id,
          yagi_product_id: product_id,
        });
      }
      //#endregion
      //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
      if (!keyword_id) {
        l("Err", "red", `No keywrod_id product_id:${product_id}`);
        return resolve(true);
      }
      // POST /product/keyword/data
      const headers = { "Accept-Encoding": "deflate, br" };
      const isExceptionKeyword = (title: string) => {
        if (!originData || !originData.exception_keyword) return false;
        if (title) return title.includes(originData.exception_keyword);
        return false;
      };
      const isRequireKeyword = (title: string) => {
        if (!originData || !originData.require_keyword) return true;
        if (title) return title.includes(originData.require_keyword);
        return true;
      }
      // p.title.includes(originData.exception_keyword) : false;
      const productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      ).then((d) => {
        if (!d.data.data.productListResult) return [];
        return (d.data.data.productListResult as any[]).filter(
          (p: ItemscoutType) =>
            p.isAd === false &&
            p.isOversea === false &&
            !isExceptionKeyword(p.title) &&
            isRequireKeyword(p.title) &&
            exceptCategory(p.category)
        );
      });

      if (productListResult.length === 0) {
        l(
          "Pass",
          "red",
          `[${index}/${max}] No Store(판매처) product_id:${product_id}, keyword:${keyword}, keyword_id=${keyword_id}`
        );
        return resolve(true);
      }
      const storeList: ProductTableV2[] = await productListResult.map(
        (p, i) => {
          return {
            index: i + 1,
            keyword,
            keyword_id,
            itemscout_product_name: p.title,
            itemscout_product_image: p.image,
            itemscout_product_id: p.productId,
            price: p.price,
            store_link: p.link,
            store_name: p.shop,
            category: p.category,
            is_naver_shop: p.isNaverShop === true ? 1 : 0,
            mall: typeof p.mall === "string" ? p.mall : p.mall.join(","),
            itemscout_mall_img: p.mallImg ? p.mallImg : null,
            review_count: p.reviewCount,
            review_score: p.reviewScore,
            delivery: p.deliveryFee,
            pc_product_url: p.pcProductUrl,
            mobile_product_url: p.mobileProductUrl,
            is_oversea:
              p.isOversea === false ? 0 : p.isOversea === true ? 1 : null,
          };
        }
      );
      if (storeList && storeList.length > 0)
        await axios.post(`https://node2.yagiyagi.kr/v2/product/keyword/data`, {
          data: storeList,
          keyword_id,
        });
      else {
        l(
          "Pass",
          "green",
          `[${index}/${max}] No Store(판매처) product_id:${product_id}, keyword:${keyword}, keyword_id=${keyword_id}`
        );
        return resolve(true);
      }
      //#endregion
      //#region (4) product_price 최종 최저가 업데이트하기
      const lowPriceObj =
        productListResult && productListResult.length
          ? productListResult.reduce((prev, value) =>
              prev.price <= value.price ? prev : value
            )
          : null;
      const idx = index + 1;
      if (!lowPriceObj) {
        l(
          "LowPrice",
          "blue",
          `[${index}/${max}] (${idx.toString().padStart(2)}) id:${product_id
            .toString()
            .padStart(5)} price: NO Price, delivery: No Delivery, No Store`
        );
        return resolve(true);
      }
      const data = {
        product_id: product_id,
        low_price: lowPriceObj.price,
        delivery: lowPriceObj.deliveryFee ? lowPriceObj.deliveryFee : 0,
        store_name:
          typeof lowPriceObj.mall !== "string" && lowPriceObj.isNaverShop
            ? "네이버 브랜드 카탈로그"
            : lowPriceObj.mall,
        store_link: lowPriceObj.link,
        review_count: lowPriceObj.reviewCount,
        type: "itemscout",
      };

      l(
        "LowPrice",
        "blue",
        `[${index}/${max}] (${idx.toString().padStart(2)}) id:${product_id
          .toString()
          .padStart(5)} price:${data.low_price
          .toString()
          .padStart(6)}, delivery: ${data.delivery.toString().padStart(4)}, ${
          data.store_name
        }`
      );

      axios
        .post("https://node2.yagiyagi.kr/product/price", data)
        .then(() => resolve(true))
        .catch(() => resolve(true));
      //#endregion
    } catch (error) {
      l(
        "error",
        "red",
        `[${index}/${max}] product_id:${product_id.toString().padStart(5)}`
      );
      console.log(error);
      resolve(true);
    }
  });

// 2. 아이템스카우트 데이터가져오기 & 야기 DB procude_price에 반영
// 네이버카탈로그 url 있으면 안가져오고 넘김.
// is_expert_review 가 있는지 없는지 비교해서 실행함.
export const updateByItemscout = async (
  size: number,
  page: number,
  is_expert_review: boolean
) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  // GET /product/keyword
  const d: {
    product_id: number; //34074;
    product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
  }[] = await axios(
    `https://node2.yagiyagi.kr/product/keyword?size=${size}&page=${page}&is_expert_review=${
      is_expert_review ? 1 : 0
    }`
  ).then((d) => d.data.data);

  for (let i = 0; i < d.length; i++) {
    const { product_id, product_name } = d[i];
    l("timestamp", "cyan", new Date().toISOString());
    await getProductByItemscout(product_id, product_name, i + 1, d.length);
  }

  l("[DONE]", "blue", "itemscout_keyword to product price");
};
