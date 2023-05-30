import cheerio from "cheerio";
import axios from "axios";
import { getAllProductIdType } from "../product_price_update";
import { StoreType } from "../updateByItemscout";
import { l } from "../console";

const headers = {
  "Accept-Encoding": "deflate, br",
  "Content-Type": "text/html;charset=UTF-8",
  "User-Agent": "PostmanRuntime/7.32.2",
  Cookie: `FUN="{'search':[{'reqUrl':'/search.pang','isValid':true}]}"; MARKETID=16747083354617770462341; PCID=16747083354617770462341; _abck=3C4CD3CF5142288C0160C4AEB1476899~-1~YAAQdTMsF/z2Xw2IAQAAu4EbawkrW38BZrWN1KdlEhRraNdrfhdfyFryNEsHMQxnpM2h+0FU33PCnNSPL6n9rARXta9chnRdv4Xjc2n/s0G4G+VRv/R7fmzPOp5LYVqlx60XT8uhAS/ceBKXA63BcJ7h3OVywCG/DZ6YA2LkKxz39alTUcPMHTs1IegvDAB7Hd3w8GjVnlyJC+Kz2WWew5auTMqt2s9oGvD13UiieQ/BSsRRGyt4TaVvuY/2oYdX7nTIqRjJUeeLtgkJPvMF8TD4Cs4Lw+z8v06QzAgYAp1tXKToWqsYobwx+Z8CRTk0QnpRDB2T1I10gfYCXolqaN11MGm9KETAfWFVrYgfI/qHeW6EVT2IyI4Ofe87CU3/Iqy/IEZYdzg=~-1~-1~-1; ak_bmsc=C3547805682E4FE5F9D088ED59762700~000000000000000000000000000000~YAAQlqUrFyDyQmuIAQAAoKmOaxN8dJEUnZbs1zXkHp0H694v4qvvcphnD7LdyM1yGFpDMwSgm/MTxHK4SS/rPGi0RzxK+I+bv1Kf8QpGQNMl/DYFDaVeMMY0Ws26SJWfjMh1HdoOJU1x6XtZ1veFnnMFPDhFSq8eHOnQ4lUU4mCNdzt8r8HHnZXQGyVnLMPNISPGJyQ+0E8JEKG+dYVrLaY6dkuJd3YNLoYiFeLhtlg3kPVKU4nOUcgKOVUQ8DgxgAH/1jP8uPgJlHILl3n6TLTrn0XQrokT21d8EAk1JcWQdbz96G2UJfQ8kg5WBxN0uFNE6CY+AT8b5gy45Cq6AyW2+lFo5OMs8XI8u2OEGI8a0h6h4gmeHdJPEn+rA0Y=; bm_sz=D64AE460CE2DD4BC72F834BCEF1A162D~YAAQdTMsF//2Xw2IAQAAu4EbaxPMb29AGATMCrEjhKP5MEHVuDAuekH4KwUiM6lFC6fd6LoCu29kNkhFDRMu4OvDGizr7H/DIDPy3tQ6KrBCbluV7/WWso2Uxvoc2AULdz6mVbceI1qNa/xQF9GR/ptucbMU99favy8nvWe0VVBmnT4wXMOONoXXMjU6Bv54Q/rVvdS/SEqTsUqEr5LMfv6vG7uP0uSNCQv2oE8KzxwLoAS5xVphPouqbUD9mVo7TLbQbVM4CeaOb5vQckO1XAZPBB8oFQxM6grnDyMUQzPGkJWE~3486515~3748165; overrideAbTestGroup=%5B%5D; sid=81aecf2754a140ce9b12601a44b2a80b0dd274ed; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR`,
};

export const getCoupangStoreDataV2 = async ({ product_id, product_name }: getAllProductIdType) => {
  const response = await axios
    .get(
      `https://www.coupang.com/np/search?rocketAll=true&q=${product_name.replace(
        / /g,
        "+"
      )}&filterType=rocket%2Ccoupang_global&rating=0&sorter=scoreDesc&listSize=36`,
      { headers }
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
  return storeList;
};
