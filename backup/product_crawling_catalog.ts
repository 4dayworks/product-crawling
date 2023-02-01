import cheerio from "cheerio";
import fs from "fs";
import request from "request";

const { log } = console;
const getProduct = (productId: number, catalogUrl: string) => {
  return new Promise((resolve) => {
    request(
      catalogUrl,
      {
        headers: {
          //     "accept-encoding": "deflate, br",
          //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
          //     "cache-control": "max-age=0",
          //     dnt: 1,
          //     "sec-ch-ua-platform": "Mac",
          //     "sec-fetch-dest": "document",
          //     "user-agent": "PostmanRuntime/7.29.2",
          //     Accept: "*/*",
          //     Connection: "keep-alive",
          // "sec-ch-ua-platform": "Android",
          // "User-Agent":
          //   "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
        },
      },
      (error, response, body) => {
        if (error) throw error;
        let $ = cheerio.load(body);

        try {
          // #section-price > ul > li:nth-child(1) > div > div > div > span > span
          // const product_item1 = $(
          //   "#section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)"
          // ).text();

          const storeList: StoreType[] = [];
          // storeList 가져오기
          $("#section-price > ul > li").each((i, item): any => {
            // 판매처이름
            const store_name = $(
              `#section-price > ul > li:nth-child(${
                i + 1
              }) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)`
            ).text();
            // 판매처 제품가격
            const regex = /[^0-9]/g;
            let product_price = Number(
              $(
                `#section-price > ul > li:nth-child(${
                  i + 1
                }) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)`
              )
                .text()
                .replace(regex, "")
            );
            product_price = product_price ? product_price : 0;
            //판매처 배송비
            let product_delivery = Number(
              $(
                `#section-price > ul > li:nth-child(${
                  i + 1
                }) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)  > div:nth-child(2) > span:nth-child(1)`
              )
                .text()
                .replace(regex, "")
            );
            product_price = product_price ? product_price : 0;
            // 판매처링크
            const product_link = $(`#section-price > ul > li:nth-child(${i + 1}) > div:nth-child(1) > a`).attr("href");
            storeList.push({
              product_id: productId,
              store_name,
              product_link,
              product_price,
              product_delivery,
            });
            log(
              "id:",
              productId,
              "store:",
              store_name,
              "store_index:",
              i,
              "price",
              product_price,
              "delivery:",
              product_delivery
            );
          });

          // 최저가 가져오기
          let cheapStore: { price: number | null; index: number | null; data: StoreType | null } = {
            price: null,
            index: null,
            data: null,
          };
          for (let index = 0; index < storeList.length; index++) {
            const data = storeList[index];
            const price = data.product_price ? data.product_price : 0;
            if (cheapStore.index === null) cheapStore = { price, index, data };
            else if (cheapStore.price != null && cheapStore.price > price) cheapStore = { price, index, data };
          }

          // 쿼리 작성
          if (cheapStore.data) writeQuery(insertForm(cheapStore.data));
        } catch (error) {
          console.error(error);
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
  )}, product_delivery = ${ifNull(product_delivery)}, store_name = ${ifNull(store_name)};`;
//#endregion

// 제외리스트
const exceptList: number[] = [];
// 찾을 리스트
const productList: [number, string][] = [
  [143, "https://msearch.shopping.naver.com/catalog/13023045079"],
  [28635, "https://msearch.shopping.naver.com/catalog/14237260695"],
  [34080, "https://msearch.shopping.naver.com/catalog/14483789464"],
  [27586, "https://msearch.shopping.naver.com/catalog/19699274631"],
  [34106, "https://msearch.shopping.naver.com/catalog/14911269432"],
  [10185, "https://msearch.shopping.naver.com/catalog/15311364784"],
  [2005, "https://msearch.shopping.naver.com/catalog/15982540239"],
  [27855, "https://msearch.shopping.naver.com/catalog/16088309396"],
  [90, "https://msearch.shopping.naver.com/catalog/16216655666"],
  [34224, "https://msearch.shopping.naver.com/catalog/16464058650"],
  [46, "https://msearch.shopping.naver.com/catalog/16646261597"],
  [206, "https://msearch.shopping.naver.com/catalog/17436439198"],
  [34107, "https://msearch.shopping.naver.com/catalog/17557536478"],
  [35, "https://msearch.shopping.naver.com/catalog/17840053533"],
  [23584, "https://msearch.shopping.naver.com/catalog/17877514162"],
  [202, "https://msearch.shopping.naver.com/catalog/17894908932"],
  [182, "https://msearch.shopping.naver.com/catalog/18149741781"],
  [123, "https://msearch.shopping.naver.com/catalog/18165832705"],
  [151, "https://msearch.shopping.naver.com/catalog/18343162898"],
  [132, "https://msearch.shopping.naver.com/catalog/18573834543"],
  [6733, "https://msearch.shopping.naver.com/catalog/18732148567"],
  [1, "https://msearch.shopping.naver.com/catalog/18732353565"],
  [7332, "https://msearch.shopping.naver.com/catalog/18757916176"],
  [34111, "https://msearch.shopping.naver.com/catalog/18793254806"],
  [5334, "https://msearch.shopping.naver.com/catalog/18882046600"],
  [25, "https://msearch.shopping.naver.com/catalog/19250492248"],
  [65, "https://msearch.shopping.naver.com/catalog/19250750950"],
  [43246, "https://msearch.shopping.naver.com/catalog/19254398622"],
  [13504, "https://msearch.shopping.naver.com/catalog/19254654640"],
  [32183, "https://msearch.shopping.naver.com/catalog/19301686546"],
  [19649, "https://msearch.shopping.naver.com/catalog/19378215038"],
  [83, "https://msearch.shopping.naver.com/catalog/19390989550"],
  [234, "https://msearch.shopping.naver.com/catalog/19391093907"],
  [21078, "https://msearch.shopping.naver.com/catalog/19391305490"],
  [17094, "https://msearch.shopping.naver.com/catalog/19489720077"],
  [17343, "https://msearch.shopping.naver.com/catalog/19490915884"],
  [88, "https://msearch.shopping.naver.com/catalog/19536779515"],
  [14, "https://msearch.shopping.naver.com/catalog/20022577538"],
  [295, "https://msearch.shopping.naver.com/catalog/20023283588"],
  [18205, "https://msearch.shopping.naver.com/catalog/20052562892"],
  [19023, "https://msearch.shopping.naver.com/catalog/20158664406"],
  [19024, "https://msearch.shopping.naver.com/catalog/20158751704"],
  [159, "https://msearch.shopping.naver.com/catalog/20514608589"],
  [36393, "https://msearch.shopping.naver.com/catalog/20828963538"],
  [16261, "https://msearch.shopping.naver.com/catalog/20907067796"],
  [738, "https://msearch.shopping.naver.com/catalog/20932299577"],
  [356, "https://msearch.shopping.naver.com/catalog/20943064230"],
  [180, "https://msearch.shopping.naver.com/catalog/21124566060"],
  [24104, "https://msearch.shopping.naver.com/catalog/21124597532"],
  [17111, "https://msearch.shopping.naver.com/catalog/21124598188"],
  [756, "https://msearch.shopping.naver.com/catalog/21126199670"],
  [25180, "https://msearch.shopping.naver.com/catalog/21126215206"],
  [24452, "https://msearch.shopping.naver.com/catalog/21126215208"],
  [24528, "https://msearch.shopping.naver.com/catalog/21285939601"],
  [156, "https://msearch.shopping.naver.com/catalog/21354725259"],
  [4848, "https://msearch.shopping.naver.com/catalog/21395373735"],
  [78, "https://msearch.shopping.naver.com/catalog/21445263832"],
  [461, "https://msearch.shopping.naver.com/catalog/21480099604"],
  [28, "https://msearch.shopping.naver.com/catalog/21630162350"],
  [38503, "https://msearch.shopping.naver.com/catalog/21893003853"],
  [6797, "https://msearch.shopping.naver.com/catalog/22005574993"],
  [8309, "https://msearch.shopping.naver.com/catalog/22006046023"],
  [27337, "https://msearch.shopping.naver.com/catalog/22057749507"],
  [122, "https://msearch.shopping.naver.com/catalog/22103121641"],
  [135, "https://msearch.shopping.naver.com/catalog/22103121641"],
  [27735, "https://msearch.shopping.naver.com/catalog/22345882746"],
  [24907, "https://msearch.shopping.naver.com/catalog/22347198113"],
  [175, "https://msearch.shopping.naver.com/catalog/22399385519"],
  [56, "https://msearch.shopping.naver.com/catalog/22469972579"],
  [280, "https://msearch.shopping.naver.com/catalog/22664903844"],
  [42935, "https://msearch.shopping.naver.com/catalog/22908197426"],
  [89, "https://msearch.shopping.naver.com/catalog/23603349490"],
  [29, "https://msearch.shopping.naver.com/catalog/23605831493"],
  [34086, "https://msearch.shopping.naver.com/catalog/23836740522"],
  [19806, "https://msearch.shopping.naver.com/catalog/24109096524"],
  [12601, "https://msearch.shopping.naver.com/catalog/24301216524"],
  [13651, "https://msearch.shopping.naver.com/catalog/24380672524"],
  [34, "https://msearch.shopping.naver.com/catalog/24386569522"],
  [15895, "https://msearch.shopping.naver.com/catalog/24594037522"],
  [35362, "https://msearch.shopping.naver.com/catalog/24702006863"],
  [7186, "https://msearch.shopping.naver.com/catalog/25153051522"],
  [106, "https://msearch.shopping.naver.com/catalog/25153950522"],
  [34090, "https://msearch.shopping.naver.com/catalog/25322332529"],
  [204, "https://msearch.shopping.naver.com/catalog/25397419527"],
  [71, "https://msearch.shopping.naver.com/catalog/25414366522"],
  [11416, "https://msearch.shopping.naver.com/catalog/25525131522"],
  [9071, "https://msearch.shopping.naver.com/catalog/26008180522"],
  [34067, "https://msearch.shopping.naver.com/catalog/26558797524"],
  [167, "https://msearch.shopping.naver.com/catalog/26558831522"],
  [387, "https://msearch.shopping.naver.com/catalog/27518193525"],
  [107, "https://msearch.shopping.naver.com/catalog/27582048524"],
  [66, "https://msearch.shopping.naver.com/catalog/27669200522"],
  [283, "https://msearch.shopping.naver.com/catalog/27682304523"],
  [1086, "https://msearch.shopping.naver.com/catalog/27697229522"],
  [9688, "https://msearch.shopping.naver.com/catalog/28388138554"],
  [55, "https://msearch.shopping.naver.com/catalog/28421288555"],
  [9631, "https://msearch.shopping.naver.com/catalog/28586609557"],
  [34109, "https://msearch.shopping.naver.com/catalog/28653191554"],
  [9703, "https://msearch.shopping.naver.com/catalog/28776369554"],
  [43209, "https://msearch.shopping.naver.com/catalog/28790191556"],
  [87, "https://msearch.shopping.naver.com/catalog/29016575586"],
  [533, "https://msearch.shopping.naver.com/catalog/29227342619"],
  [91, "https://msearch.shopping.naver.com/catalog/29425743618"],
  [63, "https://msearch.shopping.naver.com/catalog/29725407621"],
  [641, "https://msearch.shopping.naver.com/catalog/30175691622"],
  [639, "https://msearch.shopping.naver.com/catalog/30500930618"],
  [5279, "https://msearch.shopping.naver.com/catalog/30976285618"],
  [38004, "https://msearch.shopping.naver.com/catalog/30992214621"],
  [10917, "https://msearch.shopping.naver.com/catalog/31333163624"],
  [37372, "https://msearch.shopping.naver.com/catalog/31841762624"],
  [7053, "https://msearch.shopping.naver.com/catalog/31890526619"],
  [19657, "https://msearch.shopping.naver.com/catalog/31905693621"],
  [723, "https://msearch.shopping.naver.com/catalog/32461056618"],
  [7959, "https://msearch.shopping.naver.com/catalog/32558989623"],
  [2604, "https://msearch.shopping.naver.com/catalog/32938517618"],
  [501, "https://msearch.shopping.naver.com/catalog/33039885618"],
  [1991, "https://msearch.shopping.naver.com/catalog/33057321618"],
  [5144, "https://msearch.shopping.naver.com/catalog/33194965620"],
  [2364, "https://msearch.shopping.naver.com/catalog/33212403618"],
  [900, "https://msearch.shopping.naver.com/catalog/33622235618"],
  [6124, "https://msearch.shopping.naver.com/catalog/33737483619"],
  [4701, "https://msearch.shopping.naver.com/catalog/33858843618"],
  [2952, "https://msearch.shopping.naver.com/catalog/34541513618"],
  [8184, "https://msearch.shopping.naver.com/catalog/34939662619"],
  [8692, "https://msearch.shopping.naver.com/catalog/35059874623"],
  [12585, "https://msearch.shopping.naver.com/catalog/5894138486"],
  [31188, "https://msearch.shopping.naver.com/catalog/5944644989"],
  [37, "https://msearch.shopping.naver.com/catalog/6663522597"],
  [11, "https://msearch.shopping.naver.com/catalog/6743170459"],
];

const wrapSlept = async (sec: number) => await new Promise((resolve) => setTimeout(resolve, sec));
const f = async () => {
  //동작
  for (let i = 0; i < productList.length; i++) {
    const item = productList[i];
    const [productId, catalogUrl] = item;
    if (!exceptList.includes(productId)) {
      getProduct(productId, catalogUrl);
      await wrapSlept(3000);
    }
  }
  console.log("Done!");
};
f();
