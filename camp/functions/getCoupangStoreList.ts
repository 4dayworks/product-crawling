import { load } from "cheerio";

import { StoreType } from "../../function/types/craw";
import { ProductType } from "./getProductIdList";
import { getProxyData } from "./getProxyData";
import { l } from "../../function/console";

export const getCoupangStoreList = async (
  { coupang_keyword, itemscout_keyword }: ProductType,
  bot_id: number,
  proxyIP: string
) => {
  // 1. 쿠팡 키워드 없을 경우 쿠팡 데이터를 가져오지 않음.
  if (!coupang_keyword) {
    l("INFO", "green", "no coupang keyword <- 판매처 가져오지 않음");
    return [];
  }

  // 2. 쿠팡 검색 결과 페이지 크롤링하기
  const url = `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(coupang_keyword)}&channel=user`;
  const response = await getProxyData(bot_id, proxyIP, url);

  const $ = load(response.data);
  const storeList: StoreType[] = [];
  // 3. 판매처 정보 가져와서 광고 제품 필터링하기
  $("a.search-product-link").each((index, element) => {
    const store_product_name = $(element).find("dl > dd > div > div.name").text().trim();
    const store_product_image_data_src = "https:" + $(element).find("dl > dt > img").attr("data-img-src");
    const store_product_image_src = "https:" + $(element).find("dl > dt > img").attr("src");
    const store_product_image =
      store_product_image_src.includes("undefined") || store_product_image_src.includes("blank1x1")
        ? store_product_image_data_src
        : store_product_image_src;
    const store_link = "https://www.coupang.com" + $(element).attr("href");
    const store_price = Number(
      $(element).find("dl > dd > div > div.price-area > div > div.price > em > strong").text().trim().replace(/,/g, "")
    );
    const store_is_free_delivery = $(element).find("dl > dd > div.descriptions-inner").text().includes("무료배송");

    const typeSrc = $(element).find("dl > dd > div > div.price-area > div > div.price > em > span > img").attr("src");
    const outOfStock = $(element).find("dl > dd > div > div.price-area > div.out-of-stock").text().trim();
    const type = !typeSrc
      ? null
      : typeSrc.includes("Merchant")
      ? "판매자로켓"
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
      $(element).find("dl > dd > div > div.other-info > div > span.star > em").text().trim()
    );
    const store_review_count = Number(
      $(element)
        .find("dl > dd > div > div.other-info > div > span.rating-total-count")
        .text()
        .trim()
        .replace(/\(|\)/g, "")
    );

    // 4. 판매처 list에 모으기
    if (!store_product_image || outOfStock === "일시품절") return;
    const data: StoreType = {
      camp_keyword: coupang_keyword,
      origin_product_name: store_product_name,
      product_image: store_product_image,
      mall_image: null,
      price: store_price,
      delivery: store_is_free_delivery ? 0 : null,
      store_name: type || "쿠팡",
      category: null,
      review_count: store_review_count,
      review_score: store_review_score,
      is_naver_shop: false,
      is_oversea: type === "로켓직구",
      store_link,
      apiType: "coupang",
    };
    storeList.push(data);
  });

  return storeList;
};

// getCoupangStoreList("비오비타", "http://localhost:3003");
