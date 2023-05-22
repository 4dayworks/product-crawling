import cheerio from "cheerio";
import request from "request";
import { l } from "./console";
import { exceptionCompanyListAtNaver } from "./product";
import { getAllProductIdType } from "./product_price_update";

type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

export type DataListType = {
  product_id: number;
  store_name: string;
  store_link: string | null;
  store_index: number;
  price: number;
  delivery: number;
  product_name: string | null;
};

export const getProductByNaverCatalogV2 = (
  product: getAllProductIdType,
  index: number,
  max: number,
) => {
  return new Promise<{
    naverStoreList: StoreType[];
    dataList: DataListType[];
    reviewCount: number | null;
  }>(async (resolve) => {
    const productId = product.product_id;
    const catalogUrl = product.naver_catalog_link;
    const blacklist = await exceptionCompanyListAtNaver();
    if (!catalogUrl) return resolve({ dataList: [], naverStoreList: [], reviewCount: null });
    // const product_name = product.product_name;
    //#region
    try {
      request(catalogUrl, async (error, response, body) => {
        if (error) {
          l("error request", "red", error);
          resolve({dataList: [], naverStoreList: [], reviewCount: null });
          throw error;
        }
        let $ = cheerio.load(body);
        try {
          const storeList: StoreType[] = [];
          const regex = /[^0-9]/g;
          const reviewCount = Number(
            $(`#section-review > div > div > h3`).text().replace(regex, "")
          );
          const dataList: {
            product_id: number;
            store_name: string;
            store_link: string | null;
            store_index: number;
            price: number;
            delivery: number;
            product_name: string | null;
          }[] = [];
          $("#section-price > ul > li").each((i: number) => {
            // 판매처이름
            const idx = i + 1;

            const store_name = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
            ).text();

            // 회사 블랙리스트
            if (blacklist.indexOf(store_name) !== -1) {
              l("[블랙리스트 회사] PASS (naver)", "magenta", store_name);
              return;
            }

            // 판매처 제품가격
            // #section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)
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
            const delivery = deliveryStr
              ? Number(deliveryStr.replace(regex, ""))
              : 0;
            // 판매처링크
            const store_link = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > a`
            ).attr("href");
            storeList.push({
              product_id: productId,
              store_name,
              store_link,
              price,
              delivery,
            });
            l(
              "GET",
              "blue",
              `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId
                .toString()
                .padStart(5)} price:${price
                .toString()
                .padStart(5)} price:${price
                .toString()
                .padStart(6)}, delivery: ${delivery
                .toString()
                .padStart(4)}, ${store_name}`
            );

            dataList.push({
              product_id: productId,
              store_name,
              store_link: store_link ? store_link : null,
              store_index: idx,
              price,
              delivery,
              product_name: null,
            });
          });

          return resolve({ dataList, naverStoreList: storeList, reviewCount });
        } catch (error) {
          l(
            "error 1",
            "red",
            `[${index}/${max}] product_id:${productId.toString().padStart(5)}` +
              { error }
          );
          resolve({ dataList: [], naverStoreList: [], reviewCount: null });
        }
      });
    } catch {
      l(
        "error 2",
        "red",
        `[${index}/${max}] product_id:${productId.toString().padStart(5)}`
      );
      resolve({dataList: [], naverStoreList: [], reviewCount: null });
    }
  });
};
