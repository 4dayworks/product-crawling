import cheerio from "cheerio";
import request from "request";
import { l } from "./console";

export const getNaverCatalogStoreImageListV5 = (product_id: number, naver_catalog_url: string | null) => {
  return new Promise<string[] | null>(async (resolve, reject) => {
    if (!naver_catalog_url) return resolve(null);

    try {
      request(naver_catalog_url, async (error, response, body) => {
        if (error) {
          l("error request", "red", "getNaverCatalogStoreImageListV5 " + error);
          throw error;
        }
        let $ = cheerio.load(body);

        const nextData = $(`#__NEXT_DATA__`).text();

        if (!nextData) {
          $(".se-main-container > div > div > div > div > a").each((index, element) => {});
        }

        if (!nextData) return resolve(null);

        const imageList: string[] = JSON.parse(
          JSON.parse(nextData).props.pageProps.initialState
        ).specInfo.catalogSpecImages.map(
          (i: { orderNumber: number; content: string }) => "https://shopping-phinf.pstatic.net" + i.content
        );

        return resolve(imageList);
      });
    } catch {
      l("error 3", "red", `product_id:${product_id.toString().padStart(5)}`);
      reject(new Error("Naver Crawling getNaverCatalogStoreImageListV5 Error"));
    }
  });
};

export const setProductImage = (product_id: number, imaegList: string[]) => {
  return new Promise<string[] | null>(async (resolve, reject) => {});
};
// .se-main-container > div > div > div > div > a
