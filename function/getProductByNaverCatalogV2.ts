import { AuthorizationKey } from "./auth";
import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import { l } from "./console";
import { wrapSlept } from "./wrapSlept";
import { NODE_API_URL } from "./common";

type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

export const getProductByNaverCatalogV2 = (productId: number, catalogUrl: string, index: number, max: number) => {
  return new Promise(async (resolve) => {
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
          const review_count = Number($(`#__next > div > div > div > div > div > div > a`).text().replace(regex, ""));
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

            // 판매처 제품가격
            // #section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)
            const priceStr = $(
              `#section-price > ul > li:nth-child(${idx}) > div > div > div > span > span > em`
            ).text();
            const price = priceStr ? Number(priceStr.replace(regex, "")) : 0;

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
          await axios.post(`${NODE_API_URL}/product/catalog/id`, { data: dataList, product_id: productId });
          // 최저가 가져오기
          let cheapStore: { low_price: number | null; index: number | null; data: StoreType | null } = {
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
              .delete(`${NODE_API_URL}/crawling/store`, { data: { product_id: productId } })
              .then(() => resolve(true))
              .catch(() => resolve(true));
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
              .delete(`${NODE_API_URL}/crawling/store`, { data: { product_id: productId } })
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