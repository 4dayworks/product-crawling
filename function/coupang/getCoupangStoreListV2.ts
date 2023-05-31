import cheerio from "cheerio";
import axios from "axios";
import { getAllProductIdType } from "../product_price_update";
import { StoreType } from "../updateByItemscout";
import { l } from "../console";
import { uniqueId } from "lodash";
import { NODE_API_URL } from "../common";

export const getCoupangStoreListV2 = async ({ product_id, product_name }: getAllProductIdType) => {
  const getHeaders = () => {
    return {
      "Accept-Encoding": "deflate, br",
      "Content-Type": "text/html;charset=UTF-8",
      "User-Agent": "PostmanRuntime/7.32.2",
      Cookie: uniqueId(),
    };
  };

  // 1. 키워드/키워드id DB에서 가져오기
  const { coupang_require_keyword_list, coupang_exception_keyword_list }: CoupangDataType = await axios
    .get(`${NODE_API_URL}/crawling/product/coupang/keyword?product_id=${product_id}`)
    .then((d) => d.data.data)
    .catch(() => {
      console.error("ERR", `${NODE_API_URL}/crawling/product/coupang/keyword?product_id=${product_id}`);
      return {
        coupang_require_keyword_list: null,
        coupang_exception_keyword_list: null,
      };
    });
  const exception_list = coupang_exception_keyword_list
    ? coupang_exception_keyword_list.split(",").map((k) => k.trim())
    : [];
  const require_list = coupang_require_keyword_list ? coupang_require_keyword_list.split(",").map((k) => k.trim()) : [];

  // 2. 쿠팡 검색 결과 페이지 크롤링하기
  const response = await axios
    .get(
      `https://www.coupang.com/np/search?rocketAll=true&q=${product_name.replace(
        / /g,
        "+"
      )}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=rocket%2Ccoupang_global&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=18919&component=&rating=0&sorter=scoreDesc&listSize=36`,
      { headers: getHeaders() }
    )
    .catch((e) => {
      l("Err", "red", "getCoupangStoreDataV2");
      return { data: null };
    });
  const $ = cheerio.load(response.data);

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
    const typeSrc = $(element).find("dl > dd > div > div.price-area > div > div.price > em > span > img").attr("src");
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
      $(element).find("dl > dd > div > div.other-info > div > span.star > em").text().trim()
    );
    const store_review_count = Number(
      $(element)
        .find("dl > dd > div > div.other-info > div > span.rating-total-count")
        .text()
        .trim()
        .replace(/\(|\)/g, "")
    );
    const is_ad = $(element).find("dl > dd > div > span > span.ad-badge-text").text().trim() === "AD";

    // 4. 판매처 list에 모으기
    if (!type || is_ad || !store_product_image) return;
    const data: StoreType = {
      itemscout_keyword: product_name, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름",
      store_product_image,
      store_price,
      store_category: "", // "식품>건강식품>영양제>기타건강보조식품",
      store_review_count,
      store_review_score,
      store_link,
      store_delivery: 0,
      store_is_oversea: type === "로켓직구" ? true : false,
      store_is_navershop: false,
      store_name: type,
      store_product_name,
      itemscout_keyword_id: 0,
      yagi_product_id: product_id,
    };

    // 5. 제품명 DB의 require_keyword_list와 exception_keyword_list와 비교해서 필터링하기
    if (
      require_list.map((r) => data.store_product_name.includes(r)).filter((b) => b === false).length === 0 && //필수 키워드는 반드시 제품명에 있어야함
      exception_list.map((r) => data.store_product_name.includes(r)).filter((b) => b === true).length === 0 //제외 키워드는 반드시 제품명에 없어야함
    )
      storeList.push(data);
  });
  return storeList;
};

type CoupangDataType = {
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
};
