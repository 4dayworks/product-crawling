import axios from "axios";
import { l } from "./console";
import { IherbProductPriceType, IherbType, ProductType, productURLDataType } from "./iherb/updateByIherb";
import { headers } from "./iherb/headers";

// # (1)가격은 getProductPriceData 사용해서 가져오고(REST API 사용),
// # (2)제품의 상세 데이터는 getProductDescData를 통해 가져옴(페이지 크롤링)
// (2)는 iherb 데이터를 크롤링 봇으로 판단해 IP 막으므로 수동체크 반드시 필요. -> 주기적으로 돌리는 자동화 불가능
export const getProductPriceData = (urlData: productURLDataType): Promise<IherbType | null> => {
  return new Promise(async (resolve, reject) => {
    const iherbProductId = urlData.product_url.slice(
      urlData.product_url.lastIndexOf("/") + 1,
      urlData.product_url.length
    );
    // # 데이터 요청 1
    const res1 = await axios
      .get(
        `https://catalog.app.iherb.com/recommendations/freqpurchasedtogether?productId=${iherbProductId}&pageSize=2&page=1&_=1681620224467`,
        headers()
      )
      .then((d) => {
        if (d.data.errorType === undefined) return d.data as IherbProductPriceType;
        l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(3)");
        return null;
      })
      .catch((e) => (l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(4)" + e), null));
    // # 데이터 요청 2
    const res2 = await axios
      .get(`https://kr.iherb.com/ugc/api/product/v2/${iherbProductId}`, headers())
      .then(async (d) => {
        if (d.data.errorType === undefined) return d.data as ProductType;
        l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(5) ");
        return null;
      })
      .catch((e) => (l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(6)" + e), null));

    // # 더이상 안팔면 판매처 삭제필요함 가격/판매처 데이터 지우고 is_stock 0로 표시
    if (res1 === null || res2 === null) {
      const data = { iherb_product_id: iherbProductId };
      await axios.delete("http://localhost:3001/crawling/product/iherb", { data });
      return resolve(null);
    }

    const data = {
      iherb_product_id: iherbProductId,
      is_stock: res2.isAvailableToPurchase ? "1" : "0",
      is_super_sale: res1.originProduct.discountType === 7 ? "1" : "0",

      origin_price: res1.originProduct.listPrice.replace(/[^0-9]/gi, ""),
      discount_percent: res1.originProduct.salesDiscountPercentage,

      discount_type: res1.originProduct.discountType,
      discount_price: res1.originProduct.discountedPriceAmount,

      delivery_price: res1.originProduct.discountedPriceAmount > 40000 ? "0" : null, //가격이 4만원넘으면 무료배송

      rating: res1.originProduct.rating,
      review_count: res1.originProduct.ratingCount,

      // 안 가져오는 정보들
      // iherb_product_name: res1.originProduct.name,
      // iherb_product_brand: urlData.brand,
      // iherb_product_image: iherbProductImage,
      // rank: rankListString,
      // is_delivery_event: isDeliveryEvent ? "1" : "0",
      // description: description,
      // description_use: descriptionUse,
      // description_other_ingredient: descriptionOtherIngredient,
      // description_warn: descriptionWarn,
      // ingredient_amount: ingredientAmount,
      // ingredient_raw: ingredientRaw,
      // ingredient_count: ingredientCount,
      // review_url: res1.originProduct.reviewUrl,
      // list_url: urlData.list_url,
      // product_url: res1.originProduct.url,
    };

    //product_iherb의 가격만 업데이트함. 그래프(product_daily_price), 최저가(product_price) 저장은 따로 저장해야됨)
    await axios.patch(`http://localhost:3001/crawling/product/iherb/price`, data);
    resolve(null);
  });
};
