import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import { l } from "./console";

type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

export const getProductByNaverCatalog = (productId: number, catalogUrl: string, index: number, max: number) => {
  return new Promise((resolve) => {
    request(catalogUrl, (error, response, body) => {
      if (error) throw error;
      let $ = cheerio.load(body);

      try {
        const storeList: StoreType[] = [];
        const regex = /[^0-9]/g;
        const review_count = Number($(`#__next > div > div > div > div > div > div > a`).text().replace(regex, ""));
        $("#section-price > ul > li").each((i, item): any => {
          // 판매처이름
          const idx = i + 1;
          const store_name = $(
            `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
          ).text();
          // 판매처 제품가격

          let price = Number(
            $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)`
            )
              .text()
              .replace(regex, "")
          );
          price = price ? price : 0;
          //판매처 배송비
          let delivery = Number(
            $(
              `#section-price > ul > li:nth-child(${idx}) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)  > div:nth-child(2) > span:nth-child(1)`
            )
              .text()
              .replace(regex, "")
          );
          price = price ? price : 0;
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
            `(${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${price
              .toString()
              .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
          );
          const data = { product_id: productId, store_name, store_link, store_index: idx, price, delivery };
          axios.post("https://node3.yagiyagi.kr/product/catalog/id", data);
        });

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
        if (!cheapStore.data) return resolve(true);
        const { product_id, price: low_price, delivery, store_name, store_link } = cheapStore.data;
        if (!product_id || !low_price || !delivery || !store_name || !store_link) return resolve(true);
        const data = {
          product_id,
          low_price,
          delivery,
          store_name,
          store_link,
          review_count,
        };
        const idx = cheapStore.index != null ? cheapStore.index + 1 : 0;
        l(
          "LowPrice",
          "cyan",
          `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${low_price
            .toString()
            .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
        );
        axios
          .post("https://node3.yagiyagi.kr/product/price", data)
          .then(() => resolve(true))
          .catch(() => resolve(true));
      } catch (error) {
        console.error(error);
      }
    });
  });
};
