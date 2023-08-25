import axios from "axios";
import cheerio from "cheerio";
import { uniqueId } from "lodash";
import { getProductTypeV5 } from "../all_update";
import { l } from "./console";
import { StoreTypeV5 } from "./updateByItemscout";

export const getCoupangStoreListV5 = async ({ coupang_keyword }: getProductTypeV5) => {
  const getHeaders = () => {
    return {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      "Cache-Control": "no-cache",
      Dnt: "1",
      Pragma: "no-cache",
      "Sec-Ch-Ua": '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Ch-Ua-Platform": '"Windows"',
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      Cookie:
        `PCID=16928890801943952919877; trac_src=1139000; trac_spec=10799999; trac_addtag=900; trac_ctag=HOME; trac_lptag=AF6484854; trac_itime=20230824235800; sid=2cdf6b1516e9414e85be5ef7fd4962cf8ade0074; MARKETID=16928890801943952919877; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR; overrideAbTestGroup=%5B%5D; bm_sz=A3BDD1F042E5BC88F1AB40ABFFA8DE8C~YAAQTXXTF2bdCymKAQAAj9GEKhQ3SKE89NmUGZlQwVTqoEfM33tDSPmRG1MLrctq2bdOKVRWFVQ5KR3z9xazkG2eiW+hjQz9/N/RRriHXhkpux84G898pCbt3NrBzZQgFRCL04TwAh3KazkqB52FvxKa8dVKmD6+H+Ec+SRLDutGP1okp8MoWh48ndnP/dEZ0pWCH74QewHB4u8f5xZ3HZjuhmE8xO5q4PlJTY9gE8Rm6UZnBNvt/rTYQ/1kzjqgJRMx4YdFnx0GLcaca3qrHSxJMOVhHmzUKqc+dmyYvbhfbFAW~3289414~3228994; ak_bmsc=1C3CE7DEDC3A45CF6CF4EA0841D31CAE~000000000000000000000000000000~YAAQTXXTFxHeCymKAQAAm9SEKhQ5B0AC8jCi3VxOTvNAdiGZXgzfyT6M4Mnz9ulR5hJhGsX8Sw+fwo8tAWzUnTEFb2XdqnBL/MEYPmaETiyQ+dtMQcSm4DvSeJ2TMuOJIMzG08WtuViUkHD9z5o/AjEf8UStl2dr9aDa9mkfK+cECsTwT+y6oU8l6/GD8bQlt2Y4iFGPuvp9CSPjA1Eqre5LMFt+MUNUr1kZoFYJOqyrL1ZRbwomVWii2f2YzOMZQO3BEYoSp83S3VyKjSELRc6qtnl4TxUjCRFHTaLCoaJHjbzUkjlUt6IzbUxLkOEhJIh96XUHfJcPRJt/SPEZJuhrC/KVXdDoG5VbGrQ6Va1drAPFX6gYRRv8IGO/xqAYDOsqK31Bf3xA1SF1gfOxIunwA7bmsg1FESOZWq0iXO7hTDx636iRb2c75Z626TTML0goHEOsOwjphQPIXCCT5okUTLWbgxRf2ZQMxlEboygZUbBJ3Up8JD80cVdh2MG0Wbiv; _abck=F63CA9EF2EAFE709480B18DF9FBEDCF3~0~YAAQTXXTF6j1CymKAQAAOTyFKgqaSZy1xseJ9m+OZHdYi3U2ElADbXRdO4DyhhNf4rLMhINj0XkiEhvRQ0Nb1H7ShFuDfyDYUY4kj94/ZAyCwKUM7EX9E+4hOY6O+904bUg//pkJXgt6i/07xDmGQbRMV+fZjyujOtbZnACmxMlKhVX3tL4DphhTeuHQ/wu5aCk0VyU4a/td1BwukB3p6O421Cgsy2ZsIvtNeWajMpCQMHXMN/yGvY+eiELFh5um/p6+ESItI1iFd9Ex5/dLk0xbKUhpRfbyMt9dKTVvBxXRD3gsaMJvSu8yrQel2M5c64ze+ChFNLpvJ7JH9Cb1DiujeVHjeLCbtCwOD6mKafT3maXWNEhWhkTCHWRCfP9a11O2+fGeTAtrrUkEgWCJYQmEhNrCn3LUXPN0YCSUMGyGYsR13heB~-1~-1~-1; _fbp=fb.1.1692930491645.434875172; searchKeyword=%EB%89%B4%ED%8A%B8%EB%A6%AC%ED%8C%8C%EB%A7%88%20%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%8A%A4%20%EB%B9%84%ED%83%80%EB%AF%B9%EC%8A%A4%7C%EB%89%B4%ED%8A%B8%EB%A6%AC%ED%8C%8C%EB%A7%88; searchKeywordType=%7B%22%EB%89%B4%ED%8A%B8%EB%A6%AC%ED%8C%8C%EB%A7%88%20%EC%8A%A4%ED%8A%B8%EB%A0%88%EC%8A%A4%20%EB%B9%84%ED%83%80%EB%AF%B9%EC%8A%A4%22%3A0%7D%7C%7B%22%EB%89%B4%ED%8A%B8%EB%A6%AC%ED%8C%8C%EB%A7%88%22%3A0%7D; cto_bundle=6-W6SV9TcnEzV0U2ayUyQnQlMkZzbld1aGhZSFBhVk82bGx5MTIlMkZjWjZOVkM5RFI4dm11RllYSGFIU1RnNGxwN3NhNWN3WDdmYmdPRGxXWXRYcldtUVFhaUFUNWM3bklHUGc2JTJCSlpKTGZOcERjZHJJWEUzQXVzQjJucThMNkZ4aSUyQkVpTDJhTnZhZUtPYkklMkZjSDFueFZac3lhcFJ0M0ElM0QlM0Q; bm_sv=7BFE6F62809E171F9D9E37E959E439D0~YAAQnaUrF25W7RKKAQAANJSQKhSVY+Oizf+HJgz4et8XAfmF2k5TCdWLXNFfSfMuDSq28+eZDyTF1WdCHiwH7BtuIKVOtKMEhuzDelx/QUuj9SwIU8Jmf+VrrLuXQQl5Z6kXtIoiYPGomMJSvmX59RCVDtrgqNVdVwFB/+MMv83i03CwHyA+gzTKAlDBXBEKnif2n/if2SWEMMdilLjP2QVnUTkKaWX4K0xfhW5xyKB1ygAwNad2otl6hxFChDZfjwc=~1; __cf_bm=O57Tje7SI08IXyJjJ8zBU.RXFEy6cGOGthgGcmr3Dgw-1692931235-0-AdwwQmqZtV0kRjc3Sgp6FkCIX95tJXA1jx/vnN55tgWBwyjYuLjxlWnygaaS` +
        uniqueId(),
    };
  };
  // 1. 쿠팡 키워드 없을 경우 쿠팡 데이터를 가져오지 않음.
  if (!coupang_keyword) {
    l("INFO", "green", "no coupang keyword <- 판매처 가져오지 않음");
    return [];
  }

  // 2. 쿠팡 검색 결과 페이지 크롤링하기
  const url = `https://www.coupang.com/np/search?rocketAll=true&q=${coupang_keyword.replace(
    /[ \[\]]/g,
    "+"
  )}&brand=&offerCondition=&filter=&availableDeliveryFilter=&filterType=rocket_luxury%2Crocket%2Ccoupang_global&isPriceRange=false&priceRange=&minPrice=&maxPrice=&page=1&trcid=&traid=&filterSetByUser=true&channel=user&backgroundColor=&searchProductCount=719&component=&rating=0&sorter=scoreDesc&listSize=36`;

  console.log(url, getHeaders());

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
