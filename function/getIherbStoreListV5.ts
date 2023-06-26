import axios, { AxiosResponse } from "axios";
import { NODE_API_URL } from "./common";
import { l } from "./console";
import { headers as iherbHeaders } from "./iherb/headers";
import { IherbProductPriceType1, IherbProductPriceType2, ProductType } from "./iherb/updateByIherb";
import { getAllProductIdType } from "./product_price_update";
import { StoreType, StoreTypeV5 } from "./updateByItemscout";
import { IherbPriceType } from "./updateByItemscout";
import { getProductTypeV5 } from "../all_update";

// # (1)가격은 getProductPriceData 사용해서 가져오고(REST API 사용),
// # (2)제품의 상세 데이터는 getProductDescData를 통해 가져옴(페이지 크롤링)
// (2)는 iherb 데이터를 크롤링 봇으로 판단해 IP 막으므로 수동체크 반드시 필요. -> 주기적으로 돌리는 자동화 불가능
const headers = { "Accept-Encoding": "deflate, br" };
export const getIherbStoreListV5 = ({ iherb_product_id }: getProductTypeV5): Promise<StoreTypeV5[]> => {
  return new Promise(async (resolve, reject) => {
    // 1. 아이허브 없으면 무시함
    if (iherb_product_id === null) return resolve([]);

    // 2. 아이허브 데이터 가져오기
    const result = await axios
      .all([
        axios.get(
          `https://catalog.app.iherb.com/recommendations/freqpurchasedtogether?productId=${iherb_product_id}&pageSize=2&page=1&_=1681620224467`,
          iherbHeaders(true)
        ),
        axios.get(`https://kr.iherb.com/ugc/api/product/v2/${iherb_product_id}`, iherbHeaders(true)),
        axios.get(
          `https://catalog.app.iherb.com/product/${iherb_product_id}/discounts?_=1681707804820`,
          iherbHeaders(true)
        ),
      ])
      .then(
        axios.spread(
          (r1, r2, r3) =>
            [
              handleResponse(r1, "iherb 데이터를 가져올 수 없습니다.(1)"),
              handleResponse(r2, "iherb 데이터를 가져올 수 없습니다.(4)"),
              handleResponse(r3, "iherb 데이터를 가져올 수 없습니다.(3)"),
            ] as [IherbProductPriceType1, ProductType, IherbProductPriceType2]
        )
      )
      .catch(() => "Iherb Crawling Error");

    // 3. 아이허브 데이터 체크
    if (typeof result === "string") return reject(new Error(result));

    const [res1, res2, res3] = result;

    // 4. 더이상 안팔면 판매처 삭제필요함 가격/판매처 데이터 지우고 is_stock 0로 표시
    if (res2 === null) return resolve([]);

    const data = {
      iherb_product_id,
      is_stock: res2.isAvailableToPurchase ? "1" : "0",
      origin_price:
        res1?.originProduct.discountedPriceAmount ||
        res1?.originProduct.listPrice.replace(/[^0-9]/gi, "") ||
        (res3 && res3.special
          ? (res3.special.discountPrice * 100) / (100 - res3.special.discountPercentage)
          : undefined), //res1데이터 없으면 res3이용해서 할인율,할인가 역산해서 원가 계산함.
      discount_percent: res1?.originProduct.salesDiscountPercentage || res3?.special?.discountPercentage || 0,
      discount_type: res1?.originProduct.discountType || null,
      discount_price:
        res1?.originProduct.discountedPriceAmount ||
        res3?.special?.discountPrice ||
        res3?.subscription?.discountedPrice?.value ||
        null,
      delivery_price:
        (res1?.originProduct.discountedPriceAmount || res3?.special?.discountPrice || 0) > 40000 ? 0 : 5000, //가격이 4만원넘으면 무료배송
      rating: res1?.originProduct.rating,
      review_count: res1?.originProduct.ratingCount,
    };

    if (data && data.is_stock === "1") {
      const iherbDetail: { iherb_product_name: string; iherb_product_image: string; product_url: string } | null =
        await axios.get(`${NODE_API_URL}/crawling/iherb/detail?iherb_id=${iherb_product_id}`).then((d) => d.data.data);

      if (!iherbDetail) return resolve([]);
      const iherbStore: StoreTypeV5 = {
        yagi_keyword: null,
        origin_product_name: iherbDetail.iherb_product_name,
        product_image: iherbDetail.iherb_product_image,
        mall_image: null,
        price: data.discount_price,
        delivery: data.delivery_price,
        store_name: "iherb",
        category: null,
        review_count: data.review_count || 0,
        review_score: data.rating || 0,
        is_naver_shop: false,
        is_oversea: true,
        store_link: iherbDetail.product_url,
      };
      return resolve([iherbStore]);
    }

    resolve([]);
  });
};

// Handle response and error
function handleResponse(response: AxiosResponse<any, any>, errorMessage: string) {
  if (response && response.data.errorType === undefined) {
    return response.data;
  } else {
    l("ERR Data", "red", errorMessage);
    return null;
  }
}
