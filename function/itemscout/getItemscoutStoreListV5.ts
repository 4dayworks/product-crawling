import axios from "axios";
import { getProductTypeV6 } from "../../all_update";
import { NODE_API_URL } from "../common";
import { l } from "../console";
import { filterArray } from "../itemscout";
import { ItemscoutType, StoreTypeV5 } from "../updateByItemscout";

const headers = { "Accept-Encoding": "deflate, br" };
export const getItemscoutStoreListV5 = ({ itemscout_keyword, product_id }: getProductTypeV6) =>
  new Promise<StoreTypeV5[]>(async (resolve, reject) => {
    try {
      // 0. 아이템스카우트 키워드 없으면 무시하기
      if (!itemscout_keyword || !itemscout_keyword.trim()) return resolve([]);

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
        // 새 itemscout_keyword_id 업데이트
        if (itemscout_keyword_id) {
          await axios.patch(`${NODE_API_URL}/crawling/itemscout/keyword`, {
            keyword_id: itemscout_keyword_id,
            itemscout_keyword,
          });
          keyword_id = itemscout_keyword_id;
        }
      }

      //#endregion
      //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
      if (!keyword_id) {
        l("Err", "red", `No keyword_id product_id:${product_id}`);
        return resolve([]);
      }
      // POST /product/keyword/data
      let productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      ).then(async (d) => {
        let list: any[] = d.data.data.productListResult;
        if (!list) return [];
        list = filterArray(d.data.data.productListResult); //is_drugstore,
        return list;
      });

      // 리스트 없을 경우 제품명으로 다시 검색
      // if (productListResult.length === 0) {
      //   keyword = product_name;
      //   const itemscout_keyword_id = await axios.post(url, { keyword }, { headers }).then((d) => d.data.data);
      //   keyword_id = itemscout_keyword_id;
      //   productListResult = await axios(
      //     `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
      //     { headers }
      //   ).then((d) => {
      //     if (!d.data.data.productListResult) return [];
      //     const list = filterArray(d.data.data.productListResult, product, originData);

      //     return list;
      //   });
      // }

      const storeList: StoreTypeV5[] = [];
      productListResult.forEach((item) => {
        if (item.shop.includes("면세점")) return;
        if (item.shop === "iherb") return;
        const data: StoreTypeV5 = {
          yagi_keyword: itemscout_keyword,
          origin_product_name: item.title,
          product_image: item.image,
          mall_image: null,
          price: item.price,
          delivery: Number(item.deliveryFee),
          store_name: item.shop,
          category: item.category,
          review_count: item.reviewCount,
          review_score: item.reviewScore,
          is_naver_shop: item.isNaverShop,
          is_oversea: item.isOversea,
          store_link: item.mobileProductUrl || item.pcProductUrl || item.link,
        };

        storeList.push(data);
      });

      return resolve(storeList);
    } catch (error: any) {
      reject(new Error("getItemscoutStoreListV5 Error \n\t" + error.message));
    }
  });
