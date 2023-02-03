import { AuthorizationKey } from "./auth";
import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import { l } from "./console";
import { wrapSlept } from "./wrapSlept";

type StoreType = {
  product_id: number;
  store_name: string | null;
  store_link?: string | null;
  delivery: number | null;
  price: number | null;
};

const getProductByNaverCatalog = (productId: number, catalogUrl: string, index: number, max: number) => {
  return new Promise(async (resolve) => {
    console.log(1, productId);
    //#region product/is_drugstore = 1 이거나 product_price/is_manual = 1이면 새로 갱신 안함.
    try {
      const manualData:
        | {
            product_id: string | null;
            is_drugstore: number | null;
            low_price: number | null;
            delivery: number | null;
            store_name: string | null;
            store_link: string | null;
            regular_price: number | null;
            is_manual: number | null;
          }
        | undefined = await axios(`https://node2.yagiyagi.kr/product/price/manual?product_id=${productId}`).then(
        (d) => d.data.data
      );
      console.log(2, productId);
      if (manualData && (manualData.is_drugstore === 1 || manualData.is_manual === 1)) {
        if (manualData.is_drugstore === 1) l("Pass", "green", `is_drugstore === 1, product_id:${productId}`);
        else if (manualData.is_manual === 1) l("Pass", "green", `is_manual === 1, product_id:${productId}`);
        return resolve(true);
      }
      //#endregion
      // console.log(3, productId);
      request(catalogUrl, (error, response, body) => {
        if (error) {
          l("error request", "red", error);
          resolve(true);
          throw error;
        }
        let $ = cheerio.load(body);
        // console.log(4, productId);
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
              `(${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${price
                .toString()
                .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
            );
            const data = { product_id: productId, store_name, store_link, store_index: idx, price, delivery };
            axios.post("https://node2.yagiyagi.kr/product/catalog/id", data);
          });
          // console.log(5, productId);
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
          console.log(6, productId);
          // DB Insert 최저가 데이터 넣기
          if (!cheapStore.data) return resolve(true);
          console.log(7, productId);
          const { product_id, price: low_price, delivery, store_name, store_link } = cheapStore.data;
          if (!product_id || !low_price || !delivery || !store_name || !store_link) return resolve(true);
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
          console.log(8, productId);
          l(
            "LowPrice",
            "cyan",
            `[${index}/${max}] (${idx.toString().padStart(2)}) id:${productId.toString().padStart(5)} price:${low_price
              .toString()
              .padStart(6)}, delivery: ${delivery.toString().padStart(4)}, ${store_name}`
          );
          console.log(9, productId);
          axios
            .post("https://node2.yagiyagi.kr/product/price", data)
            .then(() => resolve(true))
            .catch(() => resolve(true));
        } catch (error) {
          console.log(10, productId);
          l("error", "red", `[${index}/${max}] id:${productId.toString().padStart(5)}`);
          resolve(true);
        }
      });
    } catch {
      l("Error:1", "red");
      resolve(true);
    }
  });
};

export const updateByNaverCatalog = async (size: number, page: number) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;
  const d: {
    product_id: number; //34074;
    naver_catalog_link: string; //"https://msearch.shopping.naver.com/catalog/15282323215";
  }[] = await axios(`https://node2.yagiyagi.kr/product/catalog/url?size=${size}&page=${page}`).then((d) => d.data.data);

  for (let i = 0; i < d.length; i++) {
    console.log(d.length, i);
    const { product_id, naver_catalog_link } = d[i];
    await getProductByNaverCatalog(product_id, naver_catalog_link, i + 1, d.length);
  }

  l("[DONE]", "blue", "naver_catalog_link to product price");
};
