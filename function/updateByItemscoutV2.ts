import axios from "axios";
import { NODE_API_URL } from "./common";
import { l } from "./console";
import { filterArray } from "./itemscout";
import { getAllProductIdType } from "./product_price_update";
import { ItemscoutType } from "./updateByItemscout";

const headers = { "Accept-Encoding": "deflate, br" };
export const getProductByItemscoutV2 = (product: getAllProductIdType) =>
  new Promise<{
    productListResult: ItemscoutType[];
    keyword: string;
    keyword_id: number | null;
  }>(async (resolve, reject) => {
    const originData = product;

    try {
      //#region (2) 키워드 가져오기 & 있는지 확인하고 야기 DB에 반영하기
      // GET /product/keyword/id
      let keyword_id = originData.keyword_id ? originData.keyword_id : null;
      let keyword = originData.keyword
        ? originData.keyword
        : originData.product_name;
      //  (2-1). keyword가 있고 keyword_id가 없으면 해당 키워드로 검색하고 keyword_id update하기
      const url = `https://api.itemscout.io/api/keyword`;
      if (!keyword_id) {
        const itemscout_keyword_id = await axios
          .post(url, { keyword }, { headers })
          .then((d) => d.data.data)
          .catch(() => null);
        keyword_id = itemscout_keyword_id;
      }
      //#endregion

      //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
      if (!keyword_id) {
        l("Err", "red", `No keyword_id product_id:${originData.product_id}`);
        return resolve({
          productListResult: [],
          keyword: "",
          keyword_id: null,
        });
      }
      // POST /product/keyword/data
      let productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      )
        .then(async (d) => {
          let list: any[] = d.data.data.productListResult;
          if (!list) return [];
          list = filterArray(
            d.data.data.productListResult,
            product,
            originData
          );
          return list;
        })
        .catch(() => []);

      // 리스트 없을 경우 제품명으로 다시 검색
      if (productListResult.length === 0) {
        keyword = originData.product_name;
        const itemscout_keyword_id = await axios
          .post(url, { keyword }, { headers })
          .then((d) => d.data.data);
        keyword_id = itemscout_keyword_id;
        productListResult = await axios(
          `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
          { headers }
        )
          .then((d) => {
            if (!d.data.data.productListResult) return [];
            const list = filterArray(
              d.data.data.productListResult,
              product,
              originData
            );

            return list;
          })
          .catch(() => []);
      }
      return resolve({ productListResult, keyword, keyword_id });
    } catch (error) {
      console.error(error);
      resolve({ productListResult: [], keyword: "", keyword_id: null });
    }
  });
