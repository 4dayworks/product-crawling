import { ProductTable, ItemscoutType } from "./updateByItemscout.d";
import axios from "axios";
import { l } from "./console";

const getProductByItemscout = (product_id: number, product_name: string, index: number, max: number) =>
  new Promise(async (resolve, reject) => {
    //#region (2) 키워드 가져오기 & 있는지 확인하고 야기 DB에 반영하기
    // GET /product/keyword/id
    const originData: {
      keyword: string; // '그린스토어 피로한눈엔 루테인 아스타잔틴오메가3',
      keyword_id: number | null; // 349123387,
      exception_keyword: string | null;
    } | null = await axios(`https://node3.yagiyagi.kr/product/keyword/id?product_id=${product_id}`).then(
      (d) => d.data.data
    );
    let keyword_id = originData && originData.keyword_id ? originData.keyword_id : null;
    let keyword = originData && originData.keyword ? originData.keyword : null;
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
      await axios.post(`https://node3.yagiyagi.kr/product/keyword/id`, {
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
      await axios.patch(`https://node3.yagiyagi.kr/product/keyword/id`, {
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
      await axios.patch(`https://node3.yagiyagi.kr/product/keyword/id`, {
        keyword: product_name,
        keyword_id: itemscout_keyword_id,
        yagi_product_id: product_id,
      });
    }
    //#endregion
    //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
    if (!keyword_id) return l("Err", "red", `No keywrod_id product_id:${product_id}`);
    // POST /product/keyword/data
    const headers = { "Accept-Encoding": "deflate, br" };
    const isExceptionKeyword = (title: string) => {
      if (!originData || !originData.exception_keyword) return false;
      if (title) return title.includes(originData.exception_keyword);
      return false;
    };
    // p.title.includes(originData.exception_keyword) : false;
    const productListResult: ItemscoutType[] = await axios(
      `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
      { headers }
    ).then((d) =>
      (d.data.data.productListResult as any[]).filter(
        (p: ItemscoutType) => p.isAd === false && p.isOversea === false && !isExceptionKeyword(p.title)
      )
    );
    for (let i = 0; i < productListResult.length; i++) {
      const p = productListResult[i];
      const data: ProductTable = {
        is_init: i === 0, //product_price_itemscout_data DELETE 함.
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
        is_oversea: p.isOversea === false ? 0 : p.isOversea === true ? 1 : null,
      };
      await axios.post(`https://node3.yagiyagi.kr/product/keyword/data`, data);
    }
    //#endregion
    //#region (4) product_price 최종 최저가 업데이트하기
    const lowPriceObj =
      productListResult && productListResult.length
        ? productListResult.reduce((prev, value) => (prev.price <= value.price ? prev : value))
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
        typeof lowPriceObj.mall !== "string" && lowPriceObj.isNaverShop ? "네이버 브랜드 카탈로그" : lowPriceObj.mall,
      store_link: lowPriceObj.link,
      review_count: lowPriceObj.reviewCount,
      type: "itemscout",
    };

    l(
      "LowPrice",
      "blue",
      `[${index}/${max}] (${idx.toString().padStart(2)}) id:${product_id.toString().padStart(5)} price:${data.low_price
        .toString()
        .padStart(6)}, delivery: ${data.delivery.toString().padStart(4)}, ${data.store_name}`
    );
    axios
      .post("https://node3.yagiyagi.kr/product/price", data)
      .then(() => resolve(true))
      .catch(() => resolve(true));
    //#endregion
  });

// 2. 아이템스카우트 데이터가져오기 & 야기 DB procude_price에 반영
// 네이버카탈로그 url 있으면 안가져오고 넘김.
export const updateByItemscout = async (size: number, page: number) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  // GET /product/keyword
  const d: {
    product_id: number; //34074;
    product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
  }[] = await axios(`https://node3.yagiyagi.kr/product/keyword?size=${size}&page=${page}`).then((d) => d.data.data);

  for (let i = 0; i < d.length; i++) {
    const { product_id, product_name } = d[i];
    await getProductByItemscout(product_id, product_name, i + 1, d.length);
  }

  l("[DONE]", "blue", "itemscout_keyword to product price");
};

// 키워드제거하기