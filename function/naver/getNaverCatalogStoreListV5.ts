import cheerio from "cheerio";
import request from "request";
import { l } from "../console";
import { exceptionCompanyListAtNaver } from "../product";
import { StoreTypeV5 } from "../updateByItemscout";
import { getProductTypeV6 } from "../../legacy/all_update";

export type DataListType = {
  product_id: number;
  store_name: string;
  store_link: string | null;
  store_index: number;
  price: number;
  delivery: number;
  product_name: string | null;
};

export const getNaverCatalogStoreListV5 = ({ product_id, naver_catalog_url }: getProductTypeV6) => {
  return new Promise<StoreTypeV5[]>(async (resolve, reject) => {
    const blacklist = await exceptionCompanyListAtNaver().catch((err) => []);
    if (!naver_catalog_url) return resolve([]);

    try {
      request(naver_catalog_url, async (error, response, body) => {
        let maxPrintLog = 0;
        if (error) {
          l("error request", "red", error);
          throw error;
        }
        let $ = cheerio.load(body);

        const origin_product_name =
          "(네이버 쇼핑) " + $(`#__next > div > div > div > div > div > h2`).text().replace("제품속성", "");
        let product_image = $(`#__next > div > div > div > div > div > img`).attr("src") || null;

        // 모바일 버전으로 가져오기
        const text = $(`#__next > div > div:nth-child(2) > div > div > div > div > div > div`).attr("style");
        const urlPattern = /url\((https?:\/\/[^\)]+)\)/;
        const match = (text || "").match(urlPattern);
        if (!product_image && match && match[1]) product_image = match[1] || null;

        const regex = /[^0-9]/g;
        const reviewCount = Number($(`#section-review > div > div > h3`).text().replace(regex, ""));
        try {
          let storeList: StoreTypeV5[] = [];

          $("#section-price > ul > li").each((i: number) => {
            // 판매처이름
            const idx = i + 1;
            const store_name = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
            ).text();
            // 회사 블랙리스트
            if (blacklist.indexOf(store_name) !== -1) {
              l("PASS", "magenta", `[블랙리스트 회사] PASS (naver) ${store_name}`);
              return;
            }
            // 판매처 제품가격
            const priceStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div > div > div > span > span > em`
            ).text();
            const price = priceStr ? Number(priceStr.replace(regex, "")) : 0;
            // 100원 이하 배제
            if (price <= 100) {
              l("[100원이하] 가격PASS (naver)", "magenta", store_name);
              return;
            }
            //판매처 배송비
            const deliveryStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)> span:nth-child(2)`
            ).text();
            const store_delivery = deliveryStr ? Number(deliveryStr.replace(regex, "")) : 0;
            // 판매처링크
            const store_link = $(`#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > a`).attr("href");
            if (maxPrintLog++ < 3)
              l(
                "GET",
                "white",
                `(${idx.toString().padStart(2)}) id:${product_id.toString().padStart(5)} price:${price
                  .toString()
                  .padStart(5)} price:${price.toString().padStart(6)}, delivery: ${store_delivery
                  .toString()
                  .padStart(4)}, ${store_name}`
              );

            storeList.push({
              yagi_keyword: null,
              origin_product_name,
              product_image,
              mall_image: null,
              price,
              delivery: Number(store_delivery),
              store_name,
              category: null,
              review_count: null,
              review_score: null,
              is_naver_shop: true,
              is_oversea: false,
              store_link: store_link ?? "",
            });
          });
          storeList = storeList.map((item) => ({
            ...item,
            store_review_count: reviewCount ? reviewCount / storeList.length : 0,
          }));
          return resolve(storeList);
        } catch (error) {
          l("error 1", "red", `product_id:${product_id.toString().padStart(5)}` + { error });
          reject(new Error("Naver Clawling Error"));
        }
      });
    } catch {
      l("error 2", "red", `product_id:${product_id.toString().padStart(5)}`);
      reject(new Error("Naver Clawling Error"));
    }
  });
};
