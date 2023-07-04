import cheerio from "cheerio";
import request from "request";
import { l } from "./console";
import { exceptionCompanyListAtNaver } from "./product";
import { getAllProductIdType } from "./product_price_update";
import { StoreType } from "./updateByItemscout";

export type DataListType = {
  product_id: number;
  store_name: string;
  store_link: string | null;
  store_index: number;
  price: number;
  delivery: number;
  product_name: string | null;
};

export const getNaverCatalogStoreListV2 = (product: getAllProductIdType) => {
  return new Promise<StoreType[]>(async (resolve, reject) => {
    const productId = product.product_id;
    const catalogUrl = product.naver_catalog_link;
    const blacklist = await exceptionCompanyListAtNaver().catch((err) => []);
    if (!catalogUrl) return resolve([]);

    // const product_name = product.product_name;
    //#region
    try {
      request(catalogUrl, async (error, response, body) => {
        let maxPrintLog = 0;
        if (error) {
          l("error request", "red", error);
          throw error;
        }
        let $ = cheerio.load(body);

        try {
          let storeList: StoreType[] = [];
          const regex = /[^0-9]/g;
          const reviewCount = Number($(`#section-review > div > div > h3`).text().replace(regex, ""));

          $("#section-price > ul > li").each((i: number) => {
            // 판매처이름
            const idx = i + 1;

            const store_name = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
            ).text();

            // 회사 블랙리스트
            if (blacklist.indexOf(store_name) !== -1 || store_name.includes("면세점"))
              return l("PASS", "magenta", `[블랙리스트 회사] PASS (naver) ${store_name}`);

            // 판매처 제품가격
            // #section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)
            const priceStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div > div > div > span > span > em`
            ).text();
            const price = priceStr ? Number(priceStr.replace(regex, "")) : 0;

            // 100원 이하 배제
            if (price <= 100) return l("[100원이하] 가격PASS (naver)", "magenta", store_name);

            //판매처 배송비
            const deliveryStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)> span:nth-child(2)`
            ).text();
            const delivery = deliveryStr ? Number(deliveryStr.replace(regex, "")) : 0;
            // 판매처링크
            const store_link = $(`#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > a`).attr("href");

            if (maxPrintLog++ < 3)
              l(
                "GET",
                "white",
                `(${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${price
                  .toString()
                  .padStart(5)} price:${price.toString().padStart(6)}, delivery: ${delivery
                  .toString()
                  .padStart(4)}, ${store_name}`
              );

            storeList.push({
              yagi_product_id: productId,
              store_name,
              store_link: store_link ?? "",
              store_price: price,
              itemscout_keyword_id: null,
              itemscout_keyword: null,
              store_product_name: product.product_name,
              store_is_oversea: false,
              store_is_navershop: true,
              store_delivery: delivery,
              store_product_image: "",
              store_category: "",
              store_review_count: reviewCount,
              store_review_score: null,
            });
          });
          storeList = storeList.map((item) => ({
            ...item,
            store_review_count: item.store_review_count ? item.store_review_count / storeList.length : 0,
          }));
          return resolve(storeList);
        } catch (error) {
          l("error 1", "red", `product_id:${productId.toString().padStart(5)}` + { error });
          reject(new Error("Naver Clawling Error"));
        }
      });
    } catch {
      l("error 2", "red", `product_id:${productId.toString().padStart(5)}`);
      reject(new Error("Naver Clawling Error"));
    }
  });
};
