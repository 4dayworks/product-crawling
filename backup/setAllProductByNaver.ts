import axios from "axios";
import { NODE_API_URL, toComma } from "../function/common";
import { l } from "../function/console";
import { ItemscoutType } from "../function/updateByItemscout";
import {
  ProductCompareKeywordResponseType,
  getAllProductIdType,
} from "../function/product_price_update";
import { DataListType } from "../function/getProductByNaverCatalogV2";
type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

export const setAllProductByNaver = ([
  { coupangStoreList, naverStoreList, dataList, reviewCount },
  originData,
  index,
  max,
]: [
  allData: {
    coupangStoreList: ItemscoutType[];
    naverStoreList: StoreType[];
    dataList: DataListType[];
    reviewCount: number | null;
  },
  originData: getAllProductIdType,
  index: number,
  max: number
]) => {
  return new Promise(async (resolve, reject) => {
    // 최저가 가져오기
    let cheapStore: {
      low_price: number | null;
      index: number | null;
      data: StoreType | null;
    } = {
      low_price: null,
      index: null,
      data: null,
    };
    const productId = originData.product_id;
    const product_name = originData.product_name;
    const storeList = naverStoreList;
    const catalogUrl = originData.naver_catalog_link;

    // 쿠팡 판매처 추가
    if (coupangStoreList.length) {
      coupangStoreList.forEach((c, i) => {
        if (!c.mallGrade) return;
        dataList.push({
          product_id: productId,
          store_name: c.mallGrade, //원래는 로켓타입을 썼었지만, 아이템스카우트 타입 호환성 때문에 mallGrade 사용
          store_link: c.link,
          store_index: 100 + i,
          price: c.price,
          delivery: 0,
          product_name: c.title,
        });
        l("Sub", "blue", `add - coupang store ${c.mallGrade}`);
      });
    }

    try {
      // const scoreList = await axios
      //   .post(`${NODE_API_URL}/v2/product/compare/keyword`, {
      //     original_keyword: originData.product_name,
      //     keyword_list: dataList.map((i) => i.product_name),
      //   })
      //   .then((d) => {
      //     const data: ProductCompareKeywordResponseType["resultList"] =
      //       d.data.data.resultList;
      //     return data.map((prev, i) => {
      //       return { ...prev, index: i };
      //     });
      //   })
      //   .catch((d) => {
      //     console.error("error: /product/compare/keyword", d);
      //     resolve(d);
      //     return null;
      //   });

      await axios.post(`${NODE_API_URL}/v2/product/catalog/id`, {
        data: dataList,
        product_id: productId,
      });
      for (let index = 0; index < storeList.length; index++) {
        const data = storeList[index];
        const price = data.price ? data.price : 0;
        if (cheapStore.index === null)
          cheapStore = { low_price: price, index, data };
        else if (cheapStore.low_price != null && cheapStore.low_price > price)
          cheapStore = { low_price: price, index, data };
      }
      //#region 제품 최저가 갱신시 유저에게 알림 보내기
      if (cheapStore.low_price && cheapStore.low_price > 100) {
        const notiList = await axios
          .post(`${NODE_API_URL}/crawling/product/notification`, {
            low_price: cheapStore.low_price,
            product_id: productId,
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
          const nextPrice = toComma(cheapStore.low_price);
          const subText = notiList[0].is_lowest === 1 ? ` (⚡역대최저가)` : "";
          const message = `내가 관심을 보인 ${product_name} 가격이 ${prevPriceText}${nextPrice}원으로 내려갔어요⬇️${subText}`;
          await axios
            .get(
              `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=${message}&link=/product/${productId}`
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
      // DB Insert 최저가 데이터 넣기
      if (!cheapStore.data) {
        l(
          "Pass",
          "green",
          `[${index}/${max}] no cheapStore.data, cheapStore=${JSON.stringify(
            cheapStore
          )} storeList.length=${
            storeList.length
          } product_id:${productId} url=${catalogUrl}`
        );
        await axios
          .delete(`${NODE_API_URL}/crawling/store`, {
            data: { product_id: productId },
          })
          .then(() => resolve(true))
          .catch(() => resolve(true));
        return resolve(true);
      }
      if (!cheapStore.data.price) {
        l(
          "Pass",
          "green",
          `[${index}/${max}] no cheapStore.data, cheapStore=${JSON.stringify(
            cheapStore
          )} storeList.length=${
            storeList.length
          } product_id:${productId} url=${catalogUrl}`
        );
        return resolve(true);
      }
      const {
        product_id,
        price: low_price,
        delivery,
        store_name,
        store_link,
      } = cheapStore.data;

      if (
        !product_id ||
        !low_price ||
        delivery === undefined ||
        delivery === null ||
        !store_name ||
        !store_link
      ) {
        if (!product_id)
          l(
            "Pass",
            "green",
            `[${index}/${max}] no product_id, product_id:${productId}`
          );
        if (!low_price)
          l(
            "Pass",
            "green",
            `[${index}/${max}] no low_price, product_id:${productId}`
          );
        if (delivery === undefined || delivery === null)
          l(
            "Pass",
            "green",
            `[${index}/${max}] no delivery, product_id:${productId}`
          );
        if (!store_name)
          l(
            "Pass",
            "green",
            `[${index}/${max}] no store_name, product_id:${productId}`
          );
        if (!store_link)
          l(
            "Pass",
            "green",
            `[${index}/${max}] no store_link, product_id:${productId}`
          );
        await axios
          .delete(`${NODE_API_URL}/crawling/store`, {
            data: { product_id: productId },
          })
          .then(() => resolve(true))
          .catch(() => resolve(true));
        return resolve(true);
      }
      const data = {
        product_id,
        low_price,
        delivery,
        store_name,
        store_link,
        type: "naver",
        review_count: reviewCount,
      };
      const idx = cheapStore.index != null ? cheapStore.index + 1 : 0;
      l(
        "LowPrice",
        "green",
        `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId
          .toString()
          .padStart(5)} price:${low_price
          .toString()
          .padStart(5)} price:${low_price
          .toString()
          .padStart(6)}, delivery: ${delivery
          .toString()
          .padStart(4)}, ${store_name}`
      );
      await axios
        .post(`${NODE_API_URL}/product/price`, data)
        .then(() => resolve(true))
        .catch(() => resolve(true));
    } catch (error) {
      l(
        "error 2",
        "red",
        `[${index}/${max}] product_id:${productId.toString().padStart(5)}`
      );
    }
  });
};
