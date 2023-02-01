import cheerio from "cheerio";
import fs from "fs";
import request from "request";

const { log } = console;

const getProductStoreName = (brandUrl: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const mainUrl = brandUrl
      .split("/")
      .filter((s, i) => i < 4)
      .join("/");
    request(mainUrl, {}, (error, response, body) => {
      let $ = cheerio.load(body);
      resolve($("title").text());
    });
  });

const getProduct = (productId: number, brandUrl: string) => {
  return new Promise((resolve) => {
    request(brandUrl, {}, async (error, response, body) => {
      if (error) throw error;
      let $ = cheerio.load(body);

      try {
        //  #content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)

        //판매처 쇼핑몰 이름
        const store_name = await getProductStoreName(brandUrl);

        // 판매처 제품가격
        const regex = /[^0-9]/g;
        let product_price = Number(
          $(
            "#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)"
          )
            .text()
            .replace(regex, "")
        );

        // 판매처 배송비
        let product_delivery = Number(
          $("#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div > div > span:nth-child(2)")
            .text()
            .replace(regex, "")
        );
        log("id:", productId, "store:", store_name, "price", product_price, "delivery:", product_delivery);

        // 쿼리 작성
        writeQuery(
          insertForm({
            product_id: productId,
            product_price,
            product_link: brandUrl,
            product_delivery,
            store_name,
          })
        );
      } catch (error) {
        console.error(error);
      }
    });
  });
};

const writeQuery = async (content: string) => await fs.writeFileSync("./query.txt", content, { flag: "a+" });

const ifNull = (str?: string | number | null) =>
  str ? `\'${String(str).replace(/'/gi, "\\'").replace(/"/gi, '\\"')}\'` : "null";
type StoreType = {
  product_id: number;
  store_name: string | null;
  product_link?: string | null;
  product_delivery: number | null;
  product_price: number | null;
};
const insertForm = ({
  product_id = 1,
  product_price = null,
  product_link = null,
  product_delivery = null,
  store_name = null,
}: StoreType) =>
  `INSERT INTO F_DAYWORKS.product_low_price_data (product_id, product_price, product_link, product_delivery, store_name) VALUES (${product_id}, ${ifNull(
    product_price
  )}, ${ifNull(product_link)}, ${ifNull(product_delivery)}, ${ifNull(
    store_name
  )}) ON DUPLICATE KEY UPDATE product_price = ${ifNull(product_price)}, product_link = ${ifNull(
    product_link
  )}, product_delivery = ${ifNull(product_delivery)}, store_name = ${ifNull(store_name)};
  `;
//#endregion

// 제외리스트
const exceptList: number[] = [];
// 찾을 리스트
const productList: [number, string][] = [
  [
    60,
    "https://m.brand.naver.com/nutricore/products/4334691656?NaPm=ct%3Dldbnmjco%7Cci%3D0yK0000V8X5xjpD3CvpW%7Ctr%3Dpla%7Chk%3D1ad0ddf251016609aaff46484c64e37a0769e85a",
  ],
  [
    5424,
    "https://m.brand.naver.com/yuhan/products/6420158197?NaPm=ct%3Dldbnt3go%7Cci%3D54dc2648533138b520cfae83c669d55b8603b3be%7Ctr%3Dslsf%7Csn%3D2221700%7Chk%3Dae4d5e92ede797810110dc8f57905189bb6b052b",
  ],
  [
    70,
    "https://m.brand.naver.com/yuhan/products/6740016071?NaPm=ct%3Dldbm4v94%7Cci%3D7bdbae90b48a442dede3d88cd92d1bce52766657%7Ctr%3Dslsf%7Csn%3D2221700%7Chk%3D8a8d3ced1b8bdb40cbd62f00c23bceef8eeb5e26",
  ],
];

const wrapSlept = async (sec: number) => await new Promise((resolve) => setTimeout(resolve, sec));
const f = async () => {
  //동작
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const [productId, brandUrl] = item;
    if (!exceptList.includes(productId)) {
      getProduct(productId, brandUrl);
      await wrapSlept(5000);
    }
  }
  console.log("Done!");
};
f();
