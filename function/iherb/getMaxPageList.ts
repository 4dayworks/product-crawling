import { load } from "cheerio";
import request from "request";
import { l } from "../console";
import { headers } from "./headers";

export const getMaxPageList = (list_url: string): Promise<{ maxPage: number | null; list_url: string }> => {
  return new Promise(async (resolve, reject) => {
    request(list_url, headers(), (error, _, body) => {
      if (error) {
        l("error request", "red", error);
        return reject({ maxPage: null, list_url });
      }
      const $ = load(body);
      const a = $("#product-count").html();
      const allCount = Number(a?.slice(0, 5).replace(/[^0-9]/gi, ""));
      const maxPage = Math.ceil(allCount / 48);

      return resolve({ maxPage, list_url });
    });
  });
};
