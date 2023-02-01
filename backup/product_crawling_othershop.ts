import cheerio, { CheerioAPI } from "cheerio";
import fs from "fs";
import request from "request";
import _ from "lodash";

const { log } = console;

const getUniqDomainList = (domainList: string[]) =>
  _.uniq(
    domainList.map((item) =>
      item
        .split("/")
        .filter((s, i) => i > 1 && i < 3)
        .join("/")
    )
  );
const getDomain = (url: string) =>
  url
    .split("/")
    .filter((s, i) => i > 1 && i < 3)
    .join("/");

// 중복제거 도메인 리스트
type DomainListType =
  | "m.shopping.naver.com"
  | "m.shop.interpark.com"
  | "www.lotteon.com"
  | "m.tmon.co.kr"
  | "m.smartstore.naver.com"
  | "m.coupang.com"
  | "m.11st.co.kr"
  | "m.day-r.com"
  | "m.hnsmall.com"
  | "mitem.gmarket.co.kr"
  | "mitem.auction.co.kr"
  | "m.pickatdoor.io"
  | "www.vimeal.co.kr"
  | "mw.wemakeprice.com"
  | "www.yaksamom.com";
const domainList = [
  "m.shopping.naver.com",
  "m.shop.interpark.com",
  "www.lotteon.com",
  "m.tmon.co.kr",
  "m.smartstore.naver.com",
  "m.coupang.com",
  "m.11st.co.kr",
  "m.day-r.com",
  "m.hnsmall.com",
  "mitem.gmarket.co.kr",
  "mitem.auction.co.kr",
  "m.pickatdoor.io",
  "www.vimeal.co.kr",
  "mw.wemakeprice.com",
  "www.yaksamom.com",
];

const getProductPrice = ($: CheerioAPI, domain: DomainListType) => {
  const regex = /[^0-9]/g;
  let priceDiv: any = null;
  let priceRaw: number | null = null;
  switch (domain) {
    case "m.11st.co.kr":
      priceDiv = $(`#priceLayer > div > span > b`);
      break;
    case "m.shopping.naver.com":
      priceDiv = $(`#content > div > div > fieldset > div > div > div > strong > span`);
      break;
    case "m.shop.interpark.com":
      priceDiv = $(
        `#productsContainer > div.productsContents > div.productSummary > div.priceWrap > div.price > div.priceCol > dl > dd.discountedPrice > span.numeric`
      );
      break;
    case "www.lotteon.com":
      priceDiv = $(`input#metaData`);
      priceRaw = JSON.parse(priceDiv.attr("value")).product.priceInfo.slPrc;
      break;
    case "m.tmon.co.kr":
      priceDiv = $(
        `#view-default-scene-default > div.deal_info > article.deal_info_summary > div.deal_price > p.deal_price_sell > strong`
      );
      break;
    // case "m.hnsmall.com":
    //   priceDiv = $(`div.goods-benefit-box > div:nth-child(2) > dl > dd > strong`);
    //   console.log(priceDiv.text() + "asd");
    //   break;
    case "mitem.auction.co.kr":
      priceDiv = $(
        `#DetailTab > article > div.vip_top > div.vip_top__info > div.vip_top__pricearea.vip_delivery-noti > div.vip_top__price > div > strong`
      );
      console.log(priceDiv.text() + "asd");
      break;
    default:
      break;
  }

  return priceRaw ? priceRaw : Number(priceDiv ? priceDiv.text().replace(regex, "") : 0);
};

const getProduct = (productId: number, url: string, domain: DomainListType) => {
  return new Promise((resolve) => {
    request(
      url,
      // {
      //   headers: {
      //     "accept-encoding": "deflate, br",
      //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      //     "cache-control": "max-age=0",
      //     dnt: 1,
      //     "sec-ch-ua-platform": "Mac",
      //     "sec-fetch-dest": "document",
      //     "user-agent": "PostmanRuntime/7.29.2",
      //     Accept: "*/*",
      //     Connection: "keep-alive",
      //     "User-Agent":
      //       "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
      //   },
      // },
      async (error, response, body) => {
        if (error) throw error;
        let $ = cheerio.load(body);

        try {
          const result = getProductPrice($, domain);
          if (!result) console.log("  No Price", result, domain, url);
          //  #content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)
          //판매처 쇼핑몰 이름
          // const store_name = await getProductStoreName(brandUrl);
          // // 판매처 제품가격
          // const regex = /[^0-9]/g;
          // let product_price = Number(
          //   $(
          //     "#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)"
          //   )
          //     .text()
          //     .replace(regex, "")
          // );
          // // 판매처 배송비
          // let product_delivery = Number(
          //   $("#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div > div > span:nth-child(2)")
          //     .text()
          //     .replace(regex, "")
          // );
          // log("id:", productId, "store:", store_name, "price", product_price, "delivery:", product_delivery);
          // // 쿼리 작성
          // writeQuery(
          //   insertForm({
          //     product_id: productId,
          //     product_price,
          //     product_link: brandUrl,
          //     product_delivery,
          //     store_name,
          //   })
          // );
        } catch (error) {
          console.error("Err::", error);
        }
      }
    );
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
const productList: [number, string[]][] = [
  [
    70,
    [
      "http://mitem.auction.co.kr/vip?itemNo=C521322391",
      // "http://mitem.gmarket.co.kr/Item?goodsCode=1811333817&jaehuid=200006220",
    ],
  ],
];

const wrapSlept = async (sec: number) => await new Promise((resolve) => setTimeout(resolve, sec));
const f = async () => {
  //동작
  // const domainList = getUniqDomainList(productList[0][1]);
  // console.log(domainList);

  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const [productId, otherShopUrlList] = item;

    if (!exceptList.includes(productId)) {
      // for (let j = 0; j < 6; j++) {
      for (let j = 0; j < otherShopUrlList.length; j++) {
        const url = otherShopUrlList[j];
        const domain = getDomain(url);
        if (!domainList.includes(domain)) log("Err: can't get domain", domain);
        else {
          getProduct(productId, otherShopUrlList[j], domain as DomainListType);
          await wrapSlept(500);
        }
      }
    }
  }
  console.log("Done!");
};
f();
