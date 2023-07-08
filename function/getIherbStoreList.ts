import axios, { AxiosResponse } from "axios";
import { NODE_API_URL } from "./common";
import { l } from "./console";
import { headers as iherbHeaders } from "./iherb/headers";
import { IherbProductPriceType1, IherbProductPriceType2, ProductType } from "./iherb/updateByIherb";
import { getAllProductIdType } from "./product_price_update";
import { StoreType } from "./updateByItemscout";
import { IherbPriceType } from "./updateByItemscout";

// # (1)가격은 getProductPriceData 사용해서 가져오고(REST API 사용),
// # (2)제품의 상세 데이터는 getProductDescData를 통해 가져옴(페이지 크롤링)
// (2)는 iherb 데이터를 크롤링 봇으로 판단해 IP 막으므로 수동체크 반드시 필요. -> 주기적으로 돌리는 자동화 불가능
const headers = { "Accept-Encoding": "deflate, br" };
export const getIherbStoreList = (
  product: getAllProductIdType
  // urlData: productURLDataType
): Promise<StoreType | null> => {
  return new Promise(async (resolve, reject) => {
    const urlData =
      product.iherb_list_url && product.iherb_product_url && product.iherb_brand
        ? {
            list_url: product.iherb_list_url,
            product_url: product.iherb_product_url,
            brand: product.iherb_brand,
          }
        : null;
    if (!urlData) return resolve(null);

    const iherbProductId = urlData.product_url.slice(
      urlData.product_url.lastIndexOf("/") + 1,
      urlData.product_url.length
    );

    // Make all requests concurrently

    const result = await axios
      .all([
        axios.get(
          `https://catalog.app.iherb.com/recommendations/freqpurchasedtogether?productId=${iherbProductId}&pageSize=2&page=1&_=1681620224467`,
          iherbHeaders(true)
        ),
        axios.get(`https://kr.iherb.com/ugc/api/product/v2/${iherbProductId}`, iherbHeaders(true)),
        axios.get(
          `https://catalog.app.iherb.com/product/${iherbProductId}/discounts?_=1681707804820`,
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
      .catch((e) => {
        return "Iherb Crawling Error";
      });

    if (typeof result === "string") {
      return reject(new Error(result));
    }
    const [res1, res2, res3] = result;
    // # 더이상 안팔면 판매처 삭제필요함 가격/판매처 데이터 지우고 is_stock 0로 표시
    if ((res1 === null && res2 === null) || res2 === null) {
      const data = { iherb_product_id: iherbProductId };
      await axios.delete(`${NODE_API_URL}/crawling/product/iherb`, { data });
      l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(5) ");
      return resolve(null);
    }

    const data = {
      iherb_product_id: iherbProductId,
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

    //product_iherb의 가격만 업데이트함. 그래프(product_daily_price), 최저가(product_price) 저장은 따로 저장해야됨)
    await axios.patch(`${NODE_API_URL}/crawling/product/iherb/price`, data);
    const iherbPriceData: IherbPriceType | null = data
      ? {
          ...data,
          list_url: product.iherb_list_url,
          product_url: product.iherb_product_url,
          brand: product.iherb_brand,
          iherb_product_image: product.iherb_product_image,
        }
      : null;
    if (iherbPriceData === null) return resolve(null);

    const originData = product;

    let keyword = originData.keyword ? originData.keyword : originData.product_name;

    if (iherbPriceData && iherbPriceData.is_stock === "1") {
      const iherbStore: StoreType = {
        itemscout_keyword: keyword, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름",
        store_product_image: iherbPriceData.iherb_product_image || "", // "https://shopping-phinf.pstatic.net/main_8545538/85455382789.1.jpg",
        store_price: iherbPriceData.discount_price || 0, // 25900,
        store_review_count: iherbPriceData.review_count || 0, // 19,
        store_review_score: iherbPriceData.rating || 0, //5,
        store_name: "iherb",
        store_link: iherbPriceData.product_url || "",
        store_delivery: iherbPriceData.delivery_price || 0,
        store_is_oversea: true,
        store_is_navershop: false,
        itemscout_keyword_id: null,
        store_product_name: keyword,
        store_category: "",
        yagi_product_id: product.product_id,
      };
      return resolve(iherbStore);
    }

    resolve(null);
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
