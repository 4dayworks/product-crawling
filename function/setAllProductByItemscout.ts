import axios from "axios";
import { NODE_API_URL, toComma } from "./common";
import {
  ProductCompareKeywordResponseType,
  getAllProductIdType,
} from "./product_price_update";
import { ItemscoutType, ProductTableV2 } from "./updateByItemscout";
import { minBy, sortBy } from "lodash";
import { l } from "./console";

export const setAllProductByItemscout = ([
  { keyword, keyword_id, itemscout_list, coupang_list, iherb_data },
  originData,
  index,
  max,
]: [
  allData: {
    itemscout_list: ItemscoutType[];
    coupang_list: ItemscoutType[];
    iherb_data: ItemscoutType | null;
    keyword: string;
    keyword_id: number | null;
  },
  originData: getAllProductIdType,
  index: number,
  max: number
]) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 기존 판매처 및 가격 삭제
      await axios.delete(`${NODE_API_URL}/crawling/store`, {
        data: { product_id: originData.product_id },
      });
      // 야기DB keyword, keyword_id 업데이트
      await axios.post(`${NODE_API_URL}/product/keyword/id`, {
        keyword,
        keyword_id,
        yagi_product_id: originData.product_id,
      });

      const productListResult: ItemscoutType[] = itemscout_list;
      if (iherb_data) {
        productListResult.unshift(iherb_data);
      }
      productListResult.unshift(...coupang_list);

      const scoreList =
        keyword && productListResult && productListResult.length
          ? await axios
              .post(`${NODE_API_URL}/v2/product/compare/keyword`, {
                original_keyword: keyword,
                keyword_list: productListResult.map((i) => i.title),
              })
              .then((d) => {
                const data: ProductCompareKeywordResponseType["resultList"] =
                  d.data.data.resultList;

                return data.map((prev, i) => {
                  return { ...prev, index: i };
                });
              })
              .catch((d) => {
                console.error("error: /product/compare/keyword", d);
                resolve(d);
                return null;
              })
          : [];
      const sortStoreList = scoreList
        ? sortBy(
            sortBy(
              scoreList.filter((p) => Number(p.percent) > 60),
              (p) => p.score
            )
              .reverse()
              .slice(0, 10),
            (p) => productListResult[p.index].price
          )
            .map((i) => productListResult[i.index])
            .filter((i) => i.price != 0 && i.price != null)
        : [];
      const storeList: ProductTableV2[] = sortStoreList.map((p, i) => {
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
          is_oversea:
            p.isOversea === false ? 0 : p.isOversea === true ? 1 : null,
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
      const lowPriceObj =
        sortStoreList.length > 0 ? minBy(sortStoreList, (p) => p.price) : null;

      const idx = index + 1;
      if (!lowPriceObj) {
        l(
          "LowPrice",
          "green",
          `[${index}/${max}] (${idx
            .toString()
            .padStart(2)}) id:${originData.product_id
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
          typeof lowPriceObj.mall !== "string" && lowPriceObj.isNaverShop
            ? "네이버 브랜드 카탈로그"
            : lowPriceObj.mall,
        store_link: lowPriceObj.link,
        review_count:
          originData.is_drugstore === 4 && iherb_data && iherb_data.reviewCount
            ? iherb_data.reviewCount
            : lowPriceObj.reviewCount,
        type: "itemscout",
      };

      l(
        "LowPrice",
        "green",
        `[${index}/${max}] (${idx
          .toString()
          .padStart(2)}) id:${originData.product_id
          .toString()
          .padStart(5)} price:${data.low_price
          .toString()
          .padStart(6)}, delivery: ${data.delivery.toString().padStart(4)}, ${
          data.store_name
        }`
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
              ? (d.data.data as {
                  user_id: number;
                  is_lowest: 0 | 1;
                  low_price: number;
                }[])
              : null
          )
          .catch((e) =>
            l(
              "Noti Err",
              "red",
              "최저가 알림 오류 /crawling/product/notification " + e.code
            )
          );

        const userList = notiList
          ? notiList.map((i) => i.user_id).join(",")
          : null;
        if (notiList && userList && userList.length > 0) {
          const prevPriceList = notiList.filter((i) => i);
          const prevPrice =
            prevPriceList.length > 0 ? prevPriceList[0].low_price : null;
          const prevPriceText = prevPrice ? `${toComma(prevPrice)}원에서 ` : "";
          const nextPrice = toComma(data.low_price);
          const subText = notiList[0].is_lowest === 1 ? ` (⚡역대최저가)` : "";
          const message = `내가 관심을 보인 ${originData.product_name} 가격이 ${prevPriceText}${nextPrice}원으로 내려갔어요⬇️${subText}`;
          await axios
            .get(
              `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=${message}&link=/product/${originData.product_id}`
            )
            .catch((e) =>
              l(
                "Noti Err",
                "red",
                "최저가 알림 오류 /user/firebase/send/low_price " + e.code
              )
            );
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
      l(
        "error",
        "red",
        `[${index}/${max}] product_id:${originData.product_id
          .toString()
          .padStart(5)}`
      );
      console.error(error);
      resolve(true);
    }
  });
};
