import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import { getAllProductIdType } from "../product_price_update.d";
import { NODE_API_URL, toComma } from "./common";
import { l } from "./console";
import { exceptionCompanyListAtNaver } from "./product";

type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

export const getProductByNaverCatalogV2 = (product: getAllProductIdType, index: number, max: number) => {
  return new Promise(async (resolve) => {
    const productId = product.product_id;
    const catalogUrl = product.naver_catalog_link;
    if (!catalogUrl) return resolve(true);
    const product_name = product.product_name;
    //#region
    try {
      request(catalogUrl, async (error, response, body) => {
        if (error) {
          l("error request", "red", error);
          resolve(true);
          throw error;
        }
        let $ = cheerio.load(body);
        try {
          const storeList: StoreType[] = [];
          const regex = /[^0-9]/g;
          const review_count = Number($(`#section-review > div > div > h3`).text().replace(regex, ""));
          const dataList: {
            product_id: number;
            store_name: string;
            store_link: string | null;
            store_index: number;
            price: number;
            delivery: number;
          }[] = [];
          $("#section-price > ul > li").each((i: number) => {
            // 판매처이름
            const idx = i + 1;

            const store_name = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
            ).text();

            // 회사 블랙리스트
            if (exceptionCompanyListAtNaver.indexOf(store_name) !== -1) {
              l("[블랙리스트 회사] PASS (naver)", "magenta", store_name);
              return;
            }

            // 판매처 제품가격
            // #section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)
            const priceStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div > div > div > span > span > em`
            ).text();
            const price = priceStr ? Number(priceStr.replace(regex, "")) : 0;

            // 100원 이하 배제
            if (price <= 100) {
              l("[100원이하] 가격PASS (naver)", "magenta", store_name);
              return;
            }

            //판매처 배송비
            const deliveryStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)> span:nth-child(2)`
            ).text();
            const delivery = deliveryStr ? Number(deliveryStr.replace(regex, "")) : 0;
            // 판매처링크
            const store_link = $(`#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > a`).attr("href");
            storeList.push({
              product_id: productId,
              store_name,
              store_link,
              price,
              delivery,
            });
            l(
              "GET",
              "green",
              `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${price
                .toString()
                .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
            );

            dataList.push({
              product_id: productId,
              store_name,
              store_link: store_link ? store_link : null,
              store_index: idx,
              price,
              delivery,
            });
          });
          await axios.post(`${NODE_API_URL}/product/catalog/id`, {
            data: dataList,
            product_id: productId,
          });
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
          for (let index = 0; index < storeList.length; index++) {
            const data = storeList[index];
            const price = data.price ? data.price : 0;
            if (cheapStore.index === null) cheapStore = { low_price: price, index, data };
            else if (cheapStore.low_price != null && cheapStore.low_price > price)
              cheapStore = { low_price: price, index, data };
          }

          //#region 제품 최저가 갱신시 유저에게 알림 보내기
          if (cheapStore.low_price && cheapStore.low_price > 1000) {
            const userList: string[] = await axios
              .post(`${NODE_API_URL}/crawling/product/notification`, {
                low_price: cheapStore.low_price,
                product_id: productId,
              })
              .then((d) =>
                d.data.data && d.data.data.length > 0
                  ? d.data.data.map((i: { user_id: number }) => i.user_id).join(",")
                  : null
              )
              .catch((e) => l("Noti Err", "red", "최저가 알림 오류 /crawling/product/notification " + e.code));
            if (userList && userList.length > 0) {
              await axios
                .get(
                  `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=내가 관심을 보인 ${product_name} 가격이 ${toComma(
                    cheapStore.low_price
                  )}원으로 내려갔어요⬇️&link=/product/${productId}`
                )
                .catch((e) => l("Noti Err", "red", "최저가 알림 오류 /user/firebase/send/low_price " + e.code));
            }
          }
          //#endregion

          // DB Insert 최저가 데이터 넣기
          if (!cheapStore.data) {
            l(
              "Pass",
              "green",
              `[${index}/${max}] no cheapStore.data, cheapStore=${JSON.stringify(cheapStore)} storeList.length=${
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
              `[${index}/${max}] no cheapStore.data, cheapStore=${JSON.stringify(cheapStore)} storeList.length=${
                storeList.length
              } product_id:${productId} url=${catalogUrl}`
            );
            return resolve(true);
          }
          const { product_id, price: low_price, delivery, store_name, store_link } = cheapStore.data;
          // console.log(product_id, low_price, delivery, store_name, store_link);
          if (!product_id || !low_price || delivery === undefined || delivery === null || !store_name || !store_link) {
            if (!product_id) l("Pass", "green", `[${index}/${max}] no product_id, product_id:${productId}`);
            if (!low_price) l("Pass", "green", `[${index}/${max}] no low_price, product_id:${productId}`);
            if (delivery === undefined || delivery === null)
              l("Pass", "green", `[${index}/${max}] no delivery, product_id:${productId}`);
            if (!store_name) l("Pass", "green", `[${index}/${max}] no store_name, product_id:${productId}`);
            if (!store_link) l("Pass", "green", `[${index}/${max}] no store_link, product_id:${productId}`);
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
            review_count,
            type: "naver",
          };
          const idx = cheapStore.index != null ? cheapStore.index + 1 : 0;
          l(
            "LowPrice",
            "cyan",
            `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${low_price
              .toString()
              .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
          );
          await axios
            .post(`${NODE_API_URL}/product/price`, data)
            .then(() => resolve(true))
            .catch(() => resolve(true));
        } catch (error) {
          l("error 1", "red", `[${index}/${max}] product_id:${productId.toString().padStart(5)}`);
          resolve(true);
        }
      });
    } catch {
      l("error 2", "red", `[${index}/${max}] product_id:${productId.toString().padStart(5)}`);
      resolve(true);
    }
  });
};
