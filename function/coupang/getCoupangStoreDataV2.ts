import cheerio from "cheerio";
import axios from "axios";
import { getAllProductIdType } from "../product_price_update";
import { StoreType } from "../updateByItemscout";
import { l } from "../console";
import { uniqueId } from "lodash";

export const getCoupangStoreDataV2 = async ({ product_id, product_name }: getAllProductIdType) => {
  const getHeaders = () => {
    return {
      "Accept-Encoding": "deflate, br",
      "Content-Type": "text/html;charset=UTF-8",
      "User-Agent": "PostmanRuntime/7.32.2",
      Cookie: uniqueId(),
    };
  };

  const response = await axios
    .get(
      `https://www.coupang.com/np/search?rocketAll=true&q=${product_name.replace(
        / /g,
        "+"
      )}&filterType=rocket%2Ccoupang_global&rating=0&sorter=scoreDesc&listSize=36`,
      { headers: getHeaders() }
    )
    .catch((e) => {
      l("Err", "red", "getCoupangStoreDataV2");
      return { data: null };
    });
  const $ = cheerio.load(response.data);

  const storeList: StoreType[] = [];
  //#region Data
  $("a.search-product-link").each((index, element) => {
    const store_product_name = $(element).find("dl > dd > div > div.name").text().trim();
    const store_product_image_data_src = "https:" + $(element).find("dl > dt > img").attr("data-img-src");
    const store_product_image_src = "https:" + $(element).find("dl > dt > img").attr("src");
    const store_product_image = store_product_image_src.includes("undefined")
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
    //#endregion
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
    storeList.push(data);
  });
  console.log("storeList", storeList);
  return storeList;
};
