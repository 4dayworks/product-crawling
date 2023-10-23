import axios from "axios";
import cheerio from "cheerio";
import { uniqueId } from "lodash";
import { getProductTypeV6 } from "../../all_update";
import { l } from "../console";
import { StoreTypeV5 } from "../updateByItemscout";

// const proxyIP = "http://localhost:3003";

export const getCoupangStoreListV5 = async ({ coupang_keyword }: getProductTypeV6) => {
  const getHeaders = () => {
    return {
      Accept: "*/*",
      "Accept-Encoding": "deflate, br",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      Cookie: uniqueId(),
      "Postman-Token": "2360597e-8d8b-45a2-aa5a-c76ea406ef7d",
      Host: "www.coupang.com",
      Connection: "keep-alive",
    };
  };
  // 1. 쿠팡 키워드 없을 경우 쿠팡 데이터를 가져오지 않음.
  if (!coupang_keyword) {
    l("INFO", "green", "no coupang keyword <- 판매처 가져오지 않음");
    return [];
  }

  // 2. 쿠팡 검색 결과 페이지 크롤링하기
  // .replace(    /[ \[\]]/g,    "+"  )
  const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(
    coupang_keyword
  )}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=rocket_luxury%2Crocket%2Ccoupang_global&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=719&component=&rating=0&sorter=scoreDesc&listSize=36`;

  // const response = await axios.post(proxyIP, { targetURL: url }).catch((e) => {
  //   l("Err", "red", "getCoupangStoreDataV5" + e);
  //   throw Error("Coupang Search Result Page Crawling Error");
  // });

  const response = await axios.get(url, { headers: getHeaders() }).catch((e) => {
    l("Err", "red", "getCoupangStoreDataV5" + e);
    throw Error("Coupang Search Result Page Crawling Error");
  });

  const $ = cheerio.load(response.data);
  const storeList: StoreTypeV5[] = [];
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
    const is_ad = false;
    //쿠팡 오류로 인해 뺌 2023/09/15
    //$(element).find("dl > dd > div > span > span.ad-badge-text").text().trim() === "AD";

    // 4. 판매처 list에 모으기
    if (!type || is_ad || !store_product_image || outOfStock === "일시품절") return;
    const data: StoreTypeV5 = {
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
};

type CoupangDataType = {
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
};
