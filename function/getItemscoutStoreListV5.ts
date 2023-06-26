import axios from "axios";
import { l } from "./console";
import { filterArray } from "./itemscout";
import { getProductTypeV5 } from "../all_update";
import { ItemscoutType, StoreType, StoreTypeV5 } from "./updateByItemscout";
import { NODE_API_URL } from "./common";

const headers = { "Accept-Encoding": "deflate, br" };
export const getItemscoutStoreListV5 = ({ itemscout_keyword }: getProductTypeV5) =>
  new Promise<StoreTypeV5[]>(async (resolve, reject) => {
    try {
      // 0. 아이템스카우트 키워드 없으면 무시하기
      if (!itemscout_keyword) return [];

      // 1. 과거에 사용했던 keyword_id 가져오기
      let keyword_id: number | null = await axios
        .get(`${NODE_API_URL}/crawling/itemscout/keyword?keyword=${itemscout_keyword}`)
        .then((d) => d.data.data);

      // 2. 과거 키워드id 없을 경우 야기 DB에 저장하기
      const url = `https://api.itemscout.io/api/keyword`;
      if (!keyword_id) {
        const itemscout_keyword_id = await axios
          .post(url, { keyword: itemscout_keyword }, { headers })
          .then((d) => d.data.data);
        keyword_id = itemscout_keyword_id;
      }
      //#endregion
      //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
      if (!keyword_id) {
        l("Err", "red", `No keyword_id product_id:${originData.product_id}`);
        return resolve([]);
      }
      // POST /product/keyword/data
      let productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      ).then(async (d) => {
        let list: any[] = d.data.data.productListResult;
        if (!list) return [];
        list = filterArray(d.data.data.productListResult, product, originData);
        return list;
      });

      // 리스트 없을 경우 제품명으로 다시 검색
      if (productListResult.length === 0) {
        keyword = originData.product_name;
        const itemscout_keyword_id = await axios.post(url, { keyword }, { headers }).then((d) => d.data.data);
        keyword_id = itemscout_keyword_id;
        productListResult = await axios(
          `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
          { headers }
        ).then((d) => {
          if (!d.data.data.productListResult) return [];
          const list = filterArray(d.data.data.productListResult, product, originData);

          return list;
        });
      }
      const storeList: StoreType[] = [];
      productListResult.forEach((item) => {
        const data: StoreType = {
          yagi_product_id: product.product_id,
          itemscout_keyword_id: keyword_id,
          itemscout_keyword: keyword,
          store_product_name: item.title,
          store_product_image: item.image,
          store_name: item.shop,
          store_price: item.price,
          store_category: item.category,
          store_review_count: item.reviewCount,
          store_review_score: item.reviewScore,
          store_link: item.mobileProductUrl || item.pcProductUrl || item.link,
          store_is_oversea: item.isOversea,
          store_is_navershop: item.isNaverShop,
          store_delivery: Number(item.deliveryFee),
        };

        storeList.push(data);
      });

      return resolve(storeList);
    } catch (error) {
      reject(new Error("getItemscoutStoreListV2 Error"));
    }
  });
