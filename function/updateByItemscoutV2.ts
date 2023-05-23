import axios from "axios";
import { l } from "./console";
import { filterArray } from "./itemscout";
import { getAllProductIdType } from "./product_price_update";
import { ItemscoutType, StoreType } from "./updateByItemscout";
import { getTargetUrlByNaverUrl } from "./getTargetUrlByNaverUrl";

const headers = { "Accept-Encoding": "deflate, br" };
export const getProductByItemscoutV2 = (product: getAllProductIdType) =>
  new Promise<StoreType[]>(async (resolve, reject) => {
    const originData = product;

    try {
      //#region (2) 키워드 가져오기 & 있는지 확인하고 야기 DB에 반영하기
      // GET /product/keyword/id
      let keyword_id = originData.keyword_id ? originData.keyword_id : null;
      let keyword = originData.keyword ? originData.keyword : originData.product_name;
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
        return resolve([]);
      }
      // POST /product/keyword/data
      let productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      )
        .then(async (d) => {
          let list: any[] = d.data.data.productListResult;
          if (!list) return [];
          list = filterArray(d.data.data.productListResult, product, originData);
          return list;
        })
        .catch(() => []);

      // 리스트 없을 경우 제품명으로 다시 검색
      if (productListResult.length === 0) {
        keyword = originData.product_name;
        const itemscout_keyword_id = await axios.post(url, { keyword }, { headers }).then((d) => d.data.data);
        keyword_id = itemscout_keyword_id;
        productListResult = await axios(
          `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
          { headers }
        )
          .then((d) => {
            if (!d.data.data.productListResult) return [];
            const list = filterArray(d.data.data.productListResult, product, originData);

            return list;
          })
          .catch(() => []);
      }
      const storeList: StoreType[] = [];
      productListResult.forEach(async (item) => {
        const link = await getTargetUrlByNaverUrl(item.link);
        if (!link) return;
        const data: StoreType = {
          yagi_product_id: product.product_id, // 85455382789;
          itemscout_keyword_id: keyword_id,
          itemscout_keyword: keyword, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름";
          store_product_name: item.title, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름";
          store_product_image: item.image, // "https://shopping-phinf.pstatic.net/main_8545538/85455382789.1.jpg";
          store_name: item.shop, // 11st;
          store_price: item.price, // 25900;
          store_category: item.category, // "식품>건강식품>영양제>기타건강보조식품";
          store_review_count: item.reviewCount, // 19;
          store_review_score: item.reviewCount, //5;
          store_link: link,
          store_is_oversea: item.isOversea,
          store_is_navershop: item.isNaverShop,
          store_delivery: Number(item.deliveryFee),
        };
        storeList.push(data);
      });

      return resolve(storeList);
    } catch (error) {
      console.error(error);
      resolve([]);
    }
  });
