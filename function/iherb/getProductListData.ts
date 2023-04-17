import { load } from "cheerio";
import request from "request";
import { l } from "../console";
import { headers } from "./headers";
import { productURLDataType } from "./updateByIherb";

export const getProductListData = (list_url: string): Promise<productURLDataType[]> => {
  return new Promise(async (resolve, reject) => {
    request(list_url, headers(), (error, _, body) => {
      if (error) {
        l("error request", "red", error);
        return reject([]);
      }
      const $ = load(body);
      const productDataList: productURLDataType[] = [];
      const brand = $("h1.sub-header-title").text().trim();
      $(".absolute-link-wrapper > a").each((i, e) => {
        const product_url = e.attribs["href"];
        productDataList.push({ list_url, product_url, brand });
      });

      return resolve(productDataList);
    });
  });
};
