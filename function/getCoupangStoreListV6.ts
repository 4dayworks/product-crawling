// @ts-ignore
import torRequest from "tor-request";
import cheerio from "cheerio";
import { StoreTypeV5 } from "./updateByItemscout";
import { getProductTypeV5 } from "../all_update";

export const getCoupangStoreListV6 = async ({ coupang_keyword }: getProductTypeV5): Promise<StoreTypeV5[]> => {
  if (!coupang_keyword) return [];

  try {
    const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(coupang_keyword)}`;
    const response = await torRequest.request(url); // Tor를 통해 요청 보내기

    console.log({ response: response.status });
    const $ = cheerio.load(response.body); // cheerio로 HTML 내용 로드하기
    const productElements = $("a.search-product-link");
    const storeList: StoreTypeV5[] = [];

    productElements.each((index, element) => {
      const store_product_name = $(element).find("dl > dd > div > div.name").text();
      const store_product_image_data_src = "https:" + $(element).find("dl > dt > img").attr("data-img-src");
      const store_product_image_src = "https:" + $(element).find("dl > dt > img").attr("src");
      const store_product_image =
        store_product_image_src.includes("undefined") || store_product_image_src.includes("blank1x1")
          ? store_product_image_data_src
          : store_product_image_src;
      const store_link = "https://www.coupang.com" + $(element).attr("href");
      const store_price = Number(
        $(element)
          .find("dl > dd > div > div.price-area > div > div.price > em > strong")
          .text()
          .trim()
          .replace(/,/g, "")
      );
      const typeSrc = $(element).find("dl > dd > div > div.price-area > div > div.price > em > span > img").attr("src");
      const outOfStock = $(element).find("dl > dd > div > div.price-area > div.out-of-stock").text();
      const type = !typeSrc
        ? null
        : typeSrc.includes("merchant")
        ? "제트배송"
        : typeSrc.includes("fresh")
        ? "로켓프레시"
        : typeSrc.includes("global")
        ? "로켓직구"
        : typeSrc.includes("rocket")
        ? "로켓배송"
        : null;
      const store_review_score = Number(
        $(element).find("dl > dd > div > div.other-info > div > span.star > em").text()
      );
      const store_review_count = Number(
        $(element)
          .find("dl > dd > div > div.other-info > div > span.rating-total-count")
          .text()
          .trim()
          .replace(/\(|\)/g, "")
      );
      const is_ad = $(element).find("dl > dd > div > span > span.ad-badge-text").text() === "AD";

      if (!type || is_ad || !store_product_image || outOfStock === "일시품절") return;

      const data = {
        yagi_keyword: coupang_keyword,
        origin_product_name: store_product_name,
        product_image: store_product_image,
        mall_image: null,
        price: store_price,
        delivery: 0,
        store_name: type,
        category: null,
        review_count: store_review_count,
        review_score: store_review_score,
        is_naver_shop: false,
        is_oversea: type === "로켓직구",
        store_link,
      };

      storeList.push(data);
    });

    return storeList;
  } catch (error) {
    console.error("웹 스크래핑 오류:", error);
    throw error;
  }
};
