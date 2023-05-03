import axios from "axios";
import _ from "lodash";
import { IherbPriceType } from "../product_price_update_itemscout";
import { getAllProductIdType, ProductCompareKeywordResponseType } from "./../product_price_update.d";
import { NODE_API_URL, toComma } from "./common";
import { l } from "./console";
import { ItemscoutType, ProductTableV2 } from "./updateByItemscout";

const headers = { "Accept-Encoding": "deflate, br" };
export const getProductByItemscoutV2 = (
  product: getAllProductIdType,
  index: number,
  max: number,
  iherbPriceData?: IherbPriceType | null
) =>
  new Promise(async (resolve, reject) => {
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
        l("Err", "red", `No keywrod_id product_id:${originData.product_id}`);
        return resolve(true);
      }
      // POST /product/keyword/data
      let productListResult: ItemscoutType[] = await axios(
        `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=total`,
        { headers }
      )
        .then(async (d) => {
          let list: any[] = d.data.data.productListResult;
          if (!list) return [];

          list = list.filter(
            (p: ItemscoutType) =>
              p.isAd === false &&
              (p.isOversea === false || product.is_drugstore === 4) && // is_drugstore 4는 해외제품이므로 해외여부 무시.
              !isExceptionKeyword(p.title, originData.exception_keyword) &&
              isRequireKeyword(p.title, originData.require_keyword) &&
              exceptCategory(p.category) &&
              (iherbPriceData ? p.mall != "iherb" : true)
          );

          if (iherbPriceData && iherbPriceData.is_stock === "1") {
            const iherbStore: ItemscoutType = {
              title: keyword, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름",
              image: iherbPriceData.iherb_product_image || "", // "https://shopping-phinf.pstatic.net/main_8545538/85455382789.1.jpg",
              productId: 0, // 85455382789,
              price: iherbPriceData.discount_price || 0, // 25900,
              category: "", // "식품>건강식품>영양제>기타건강보조식품",
              reviewCount: iherbPriceData.review_count || 0, // 19,
              reviewScore: iherbPriceData.rating || 0, //5,
              chnlSeq: undefined,
              mallPids: [],
              isException: false,
              categoryStack: [],
              shop: "iherb",
              isList: false,
              link: iherbPriceData.product_url || "",
              mallPid: "",
              multiShops: 0,
              volume: 0,
              openDate: "",
              purchaseCnt: 0,
              keepCnt: 0,
              mallGrade: "iherb",
              deliveryFee: String(iherbPriceData.delivery_price || 0),
              chnlSeqs: [],
              mall: "iherb",
              mallImg: null,
              isOversea: true,
              isNaverShop: false,
              isAd: false,
              pcProductUrl: iherbPriceData.product_url || undefined,
              mobileProductUrl: iherbPriceData.product_url || undefined,
            };
            l("Sub", "blue", "add - iherb store");
            list.unshift(iherbStore);
          }
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
            return (d.data.data.productListResult as any[]).filter(
              (p: ItemscoutType) =>
                p.isAd === false &&
                (p.isOversea === false || product.is_drugstore === 4) && // is_drugstore 4는 해외제품이므로 해외여부 무시.
                !isExceptionKeyword(p.title, originData.exception_keyword) &&
                isRequireKeyword(p.title, originData.require_keyword) &&
                exceptCategory(p.category)
            );
          })
          .catch(() => []);
      }
      // 기존 판매처 및 가격 삭제
      await axios.delete(`${NODE_API_URL}/crawling/store`, { data: { product_id: originData.product_id } });
      // 야기DB keyword, keyword_id 업데이트
      await axios.post(`${NODE_API_URL}/product/keyword/id`, {
        keyword,
        keyword_id,
        yagi_product_id: originData.product_id,
      });

      const scoreList =
        keyword && productListResult && productListResult.length
          ? await axios
              .post(`${NODE_API_URL}/product/compare/keyword${iherbPriceData ? "/oversea" : ""}`, {
                original_keyword: keyword,
                keyword_list: productListResult.map((i) => i.title),
              })
              .then((d) => {
                const data: ProductCompareKeywordResponseType["resultList"] = d.data.data.resultList;

                return data.map((prev, i) => {
                  return { ...prev, index: i };
                });
              })
              .catch((d) => {
                console.log("error: /product/compare/keyword", d);
                resolve(d);
                return null;
              })
          : [];

      const sortStoreList = scoreList
        ? _.sortBy(
            _.sortBy(
              scoreList.filter((p) => Number(p.percent) > 30),
              (p) => p.score
            )
              .reverse()
              .slice(0, 10),
            (p) => productListResult[p.index].price
          )
            .map((i) => productListResult[i.index])
            .filter((i) => i.price != 0 && i.price != null)
        : [];

      const storeList: ProductTableV2[] = await sortStoreList.map((p, i) => {
        return {
          index: i + 1,
          keyword,
          keyword_id,
          itemscout_product_name: p.title,
          itemscout_product_image: p.image,
          itemscout_product_id: p.productId,
          price: p.price,
          store_link: p.link,
          store_name: p.shop,
          category: p.category,
          is_naver_shop: p.isNaverShop === true ? 1 : 0,
          mall: typeof p.mall === "string" ? p.mall : p.mall.join(","),
          itemscout_mall_img: p.mallImg ? p.mallImg : null,
          review_count: p.reviewCount,
          review_score: p.reviewScore,
          delivery: p.deliveryFee,
          pc_product_url: p.pcProductUrl,
          mobile_product_url: p.mobileProductUrl,
          is_oversea: p.isOversea === false ? 0 : p.isOversea === true ? 1 : null,
        };
      });

      if (storeList.length === 0) {
        l(
          "Pass",
          "red",
          `[${index}/${max}] No Store(판매처) product_id:${originData.product_id}, keyword:${keyword}, keyword_id=${keyword_id}`
        );
        return resolve(true);
      } else {
        await axios
          .post(`${NODE_API_URL}/v3/product/keyword/data`, {
            data: storeList,
            keyword_id,
            product_id: originData.product_id,
          })
          .catch(() => {});
      }
      //#endregion
      //#region (4) product_price 최종 최저가 업데이트하기
      const lowPriceObj = sortStoreList.length > 0 ? _.minBy(sortStoreList, (p) => p.price) : null;

      const idx = index + 1;
      if (!lowPriceObj) {
        l(
          "LowPrice",
          "blue",
          `[${index}/${max}] (${idx.toString().padStart(2)}) id:${originData.product_id
            .toString()
            .padStart(5)} price: NO Price, delivery: No Delivery, No Store`
        );
        return resolve(true);
      }
      const data = {
        product_id: originData.product_id,
        low_price: lowPriceObj.price,
        delivery: lowPriceObj.deliveryFee,
        store_name:
          typeof lowPriceObj.mall !== "string" && lowPriceObj.isNaverShop ? "네이버 브랜드 카탈로그" : lowPriceObj.mall,
        store_link: lowPriceObj.link,
        review_count:
          product.is_drugstore === 4 && iherbPriceData && iherbPriceData.review_count
            ? iherbPriceData.review_count
            : lowPriceObj.reviewCount,
        type: "itemscout",
      };

      l(
        "LowPrice",
        "blue",
        `[${index}/${max}] (${idx.toString().padStart(2)}) id:${originData.product_id
          .toString()
          .padStart(5)} price:${data.low_price.toString().padStart(6)}, delivery: ${data.delivery
          .toString()
          .padStart(4)}, ${data.store_name}`
      );

      //#region 제품 최저가 갱신시 유저에게 알림 보내기
      if (data.low_price && data.low_price > 100) {
        const notiList = await axios
          .post(`${NODE_API_URL}/crawling/product/notification`, {
            low_price: data.low_price,
            product_id: data.product_id,
          })
          .then((d) =>
            d.data.data && d.data.data.length > 0
              ? (d.data.data as { user_id: number; is_lowest: 0 | 1; low_price: number }[])
              : null
          )
          .catch((e) => l("Noti Err", "red", "최저가 알림 오류 /crawling/product/notification " + e.code));

        const userList = notiList ? notiList.map((i) => i.user_id).join(",") : null;
        if (notiList && userList && userList.length > 0) {
          const prevPriceList = notiList.filter((i) => i);
          const prevPrice = prevPriceList.length > 0 ? prevPriceList[0].low_price : null;
          const prevPriceText = prevPrice ? `${toComma(prevPrice)}원에서 ` : "";
          const nextPrice = toComma(data.low_price);
          const subText = notiList[0].is_lowest === 1 ? ` (⚡역대최저가)` : "";
          const message = `내가 관심을 보인 ${originData.product_name} 가격이 ${prevPriceText}${nextPrice}원으로 내려갔어요⬇️${subText}`;
          await axios
            .get(
              `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=${message}&link=/product/${originData.product_id}`
            )
            .catch((e) => l("Noti Err", "red", "최저가 알림 오류 /user/firebase/send/low_price " + e.code));
        }
      }
      //#endregion

      await axios
        .post(`${NODE_API_URL}/product/price`, data)
        .then(() => resolve(true))
        .catch(() => resolve(true));
      resolve(true);
      //#endregion
    } catch (error) {
      l("error", "red", `[${index}/${max}] product_id:${originData.product_id.toString().padStart(5)}`);
      console.log(error);
      resolve(true);
    }
  });

/** 건강식품 카테고리는 아니지만, 효과는 건강식품인 카테고리 */
const acceptCategoryObj: {
  [key: string]: boolean;
} = {
  "식품>다이어트식품>가르시니아": true,
  "식품>다이어트식품>기타다이어트식품": true,
  "식품>다이어트식품>단백질보충제": true,
  "식품>다이어트식품>단백질보충제>단백질파우더": true,
  "식품>다이어트식품>식이섬유": true,
  "식품>다이어트식품>다이어트바": true,
  "식품>다이어트식품>콜라겐": true,
  "식품>다이어트식품>히알루론산": true,
  "식품>다이어트식품": true,
};

/** 건강식품 중에서 받으면 안되는 것 */
const exceptCategoryObj: {
  [key: string]: boolean;
} = {
  "식품>건강식품>환자식/영양보충식": true,
  "식품>건강식품>건강즙/과일즙": true,
  "식품>건강식품>한방재료": true,
};

/** 제외해야할 category를 필터링 해주는 함수입니다.
 * 순서는 무조건 아래의 if문으로 사용해야합니다.
 * 건강식품 카테고리가 아닌 상품에 대해서 먼저 처리해야하기 때문에 순서가 중요합니다.
 */
const exceptCategory = (category: string) => {
  const categoryData = String(category).split(">");
  if (categoryData[0] !== "식품") return false;
  if (acceptCategoryObj[category]) return true;
  if (exceptCategoryObj[category]) return false;
  if (categoryData[1] !== "건강식품") return false;
  return true;
};

const isExceptionKeyword = (title: string, exception_keyword: string | null) => {
  if (!exception_keyword) return false;
  if (title) return title.includes(exception_keyword);
  return false;
};
const isRequireKeyword = (title: string, require_keyword: string | null) => {
  if (!require_keyword) return true;
  if (title) return title.includes(require_keyword);
  return true;
};
