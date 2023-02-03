import fs from "fs";
import { Product, TableProduct } from "./product_itemscout.d";
import axios from "axios";

//#region 쿼리 짜기 함수
const writeQuery = async (content: string) => await fs.writeFileSync("./query.txt", content, { flag: "a+" });

const ifNull = (str?: string | number | null) =>
  str ? `\'${String(str).replace(/'/gi, "\\'").replace(/"/gi, '\\"')}\'` : "null";

const insertForm = ({
  keyword = null,
  keyword_id = -1,
  itemscout_product_name = null,
  itemscout_product_image = null,
  itemscout_product_id = null,
  price = null,
  store_link = null,
  store_name = null,
  category = null,
  is_naver_shop,
  mall = null,
  review_count = null,
  review_score = null,
  delivery_fee = null,
  pc_product_url,
  mobile_product_url,
  index,
}: TableProduct) =>
  `INSERT INTO F_DAYWORKS.product_itemscout_data 
(keyword, keyword_id, itemscout_product_name, itemscout_product_image, itemscout_product_id, 
  price, store_link, store_name, category, is_naver_shop, mall, review_count, review_score, delivery_fee, 
  pc_product_url, mobile_product_url, \`index\`) 
  VALUES(
  ${ifNull(keyword)},
  ${ifNull(keyword_id)},
  ${ifNull(itemscout_product_name)},
  ${ifNull(itemscout_product_image)},
  ${ifNull(itemscout_product_id)},
  ${ifNull(price)},
  ${ifNull(store_link)},
  ${ifNull(store_name)},
  ${ifNull(category)},
  ${ifNull(is_naver_shop)},
  ${ifNull(mall)},
  ${ifNull(review_count)},
  ${ifNull(review_score)},
  ${ifNull(delivery_fee)},
  ${ifNull(pc_product_url)},
  ${ifNull(mobile_product_url)},
  ${ifNull(index)})
 ON DUPLICATE KEY UPDATE
keyword=${ifNull(keyword)},
keyword_id=${ifNull(keyword_id)},
itemscout_product_name=${ifNull(itemscout_product_name)},
itemscout_product_image=${ifNull(itemscout_product_image)},
itemscout_product_id=${ifNull(itemscout_product_id)},
price=${ifNull(price)},
store_link=${ifNull(store_link)},
store_name=${ifNull(store_name)},
category=${ifNull(category)},
is_naver_shop=${ifNull(is_naver_shop)},
mall=${ifNull(mall)},
review_count=${ifNull(review_count)},
review_score=${ifNull(review_score)},
delivery_fee=${ifNull(delivery_fee)},
pc_product_url=${ifNull(pc_product_url)},
mobile_product_url=${ifNull(mobile_product_url)};
`;
//#endregion
//#region 메인 로직
const getData = (keywordId: number): Promise<Product[]> =>
  new Promise(async (resolve, reject) => {
    const headers = { "Accept-Encoding": "deflate, br" };
    const {
      data: {
        data: { productListResult },
      },
    } = await axios(`https://api.itemscout.io/api/v2/keyword/products?kid=${keywordId}&type=total`, { headers });
    resolve(productListResult);
  });

const execute = async (keyword: string, keyword_id: number, index: string) => {
  // const keyword = "블랙킹타임"; //검색어
  // const keyword_id = 2065815; //아이템스카우트의 keyworkd id값
  const result = await getData(keyword_id).then((d) =>
    d
      .filter((p) => p.isAd === false && p.isOversea === false)
      .map((p, index) => {
        return {
          keyword,
          keyword_id,
          itemscout_product_name: p.title,
          itemscout_product_image: p.image,
          itemscout_product_id: p.productId,
          price: p.price,
          category: p.category,
          is_naver_shop: p.isNaverShop === true ? 1 : 0,
          store_link: p.link,
          store_name: p.shop,
          mall: typeof p.mall === "string" ? p.mall : p.mall.join(","),
          review_count: p.reviewCount,
          review_score: p.reviewScore,
          delivery_fee: p.deliveryFee,
          pc_product_url: p.pcProductUrl,
          mobile_product_url: p.mobileProductUrl,
          index: index + 1,
        };
      })
  );
  if (result && result.length) result.map((p) => writeQuery(insertForm(p)));
  console.log(`${index} keyword:`, keyword, keyword_id, " Complete !");
};
//#endregion

// 제외리스트
const exceptList: number[] = [];
// 찾을 리스트
const productList: [string, number][] = [
  ["유한 코엔자임Q10", 349021813],
  ["닥터에스더 위케어 그린세라", 291075353],
  ["블랙킹 타임", 349018918],
  ["킨더츄 포도맛", 349022415],
  ["마더스 액상 철분", 247480734],
  ["진큐피에스(GinQPS)", 349022807],
  ["유한m 프리미엄 철분 엽산", 349023173],
  ["닥터에스더 식물성 알티지오메가3", 306513412],
  ["유한 코엔자임Q10", 349021813],
  ["닥터에스더 위케어 그린세라", 291075353],
  ["블랙킹 타임", 349018918],
  ["킨더츄 포도맛", 349022415],
  ["마더스 액상 철분", 247480734],
  ["진큐피에스(GinQPS)", 349022807],
  ["유한m 프리미엄 철분 엽산", 349023173],
  ["닥터에스더 식물성 알티지오메가3", 306513412],
  ["뉴트리코어 NCS 초임계 알티지 rtg 오메가3 834mg x 60캡슐 1개월분", 328478321],
  ["위&장 듀얼케어", 324954087],
  ["조아제약 오랄스프레이 프로폴리스 30ml", 349024399],
  ["조아제약 조아큐텐홍 1200mg x 60캡슐", 349024901],
  ["드시모네 팜 키즈", 306429769],
  ["비타블로썸 메가비타민C3000크리스탈", 349023021],
  ["드시모네 팜 베이비", 306429768],
  ["쏘팔메토 쏘팔옥타코펜 4종 기능성 고함량 2개월(60캡슐) 2개월 (60캡슐)", 349025531],
  ["닥터에스더 어린콜라겐 비오틴 플러스", 304215183],
  ["VITAMIN D 5000IU", 274381591],
  ["닥터 퍼스트 맘 오메가3 (60캡슐) 1개", 330871523],
  ["NatureWith 더오메가3", 349027085],
  ["재로우 우먼스 펨 도필러스 프로바이오틱스 유산균", 298199702],
  ["조인트 엠에스엠 9988", 349027453],
  ["드시모네 4500억", 283549063],
  ["마더스셀렌효모골드", 49372812],
  ["유한 식물성MSM 플러스", 349027795],
  ["눈건강 슈퍼 루테인 골드", 251510507],
  ["보령 보령제약 브링 식물성 알티지 오메가3 60캡슐", 349028313],
  ["하루 건강애(愛) 딱이야", 349031385],
  ["맥스컷 다이어트 부스터3.1", 313283973],
  ["오메가3 슈퍼골드 1100", 349031766],
  ["장 비움 프로젝트", 311489482],
  ["눈에좋은 마더스 메가아스테인", 244092142],
  ["프로진프로폴리스아연", 306027867],
  ["액티브라이프 눈건강", 243980520],
  ["유한 알티지 식물성오메가3", 248237718],
  ["닥터 써니디 드롭스 1000IU", 249217509],
  ["관절연골엔보스웰리아", 5499654],
  ["모마네 이너젠(Momane Inner Gen)", 304230555],
  ["모마네 파워퍼플(Momane Power Purple)", 309065945],
  ["람노플 여성 유산균", 302186667],
  ["일양약품 비타민D3 4000IU 프리미엄 120캡슐", 349032598],
  ["아이사랑 슈퍼면역젤리 엘더베리맛", 266316488],
  ["한미프로폴리스골드", 52219297],
  ["브레인 파워 1080", 349033091],
  ["드시모네365 포도향", 265133189],
  ["인사비트 골드 플러스", 266457025],
  ["징크드롭", 5566883],
  ["지디 다이어트 시너지컷", 304419150],
  ["re-GEN 엠에스엠", 349033562],
  ["한미루테인맥스(MAX)", 237479577],
  ["마그 징코 매니아 플러스", 349033740],
  ["프로락 정", 306298317],
  ["엘리나 C", 349034480],
  ["방광의 배뇨기능 개선에 도움을 줄 수 있는 YO(요)", 245617749],
  ["리버락골드캡슐", 101674926],
  ["데일리베스트 종합비타민 미네랄 츄잉정", 247618138],
];
const wrapSlept = async (sec: number) => await new Promise((resolve) => setTimeout(resolve, sec));
// 메인로직
// const f = async () => {
//   const max = 3; //productList.length;
//   for (let i = 0; i < max; i++) {
//     const [keyword, keyword_id] = productList[i];
//     if (!exceptList.includes(keyword_id)) {
//       if (i != 0) await wrapSlept(1002);
//       execute(keyword, keyword_id, `[${i + 1}/${max}]`);
//     }
//     if (i === max - 1) {
//       await wrapSlept(100);
//       console.log(`[${max}/${max}] Done!`);
//     }
//   }
// };
// f();

// 야기DB product_name / keyword 가져오기
const getYagiProduct = async (page: number) => {
  const url = `https://node2.yagiyagi.kr/product/keyword?size=100&page=${page}`;
  const d: {
    product_id: number; //100;
    product_name: string | null; //"리퀴드씨엠(CM)";
    keyword: string | null; //null;
    keyword_id: string | null; //null;
  }[] = await axios.get(url).then((d) => d.data.data);

  d.map(async ({ keyword, keyword_id, product_name, product_id }, i, arr) => {
    // 1.키워드id 없으면 itemscout에서 가져오기
    if (keyword_id == null && product_id < 4) {
      const search_keyword = keyword || product_name;
      if (!search_keyword) return;
      const url = `https://api.itemscout.io/api/keyword`;
      const headers = { "Accept-Encoding": "deflate, br" };
      const itemscout_keyword_id = await axios
        .post(url, { keyword: search_keyword }, { headers })
        .then((d) => d.data.data);
      console.log(
        `[${i + 1}/${arr.length}]`,
        "search_keyword:",
        search_keyword,
        "itemscout_keyword_id:",
        itemscout_keyword_id
      );

      //1-1. 수동추가여부(column:is_manual)
      const is_manual = product_name !== search_keyword ? 1 : 0;
      await axios.post("https://node2.yagiyagi.kr/product/keyword/id", {
        keyword: search_keyword,
        keyword_id,
        product_id,
        is_manual,
      });
      await wrapSlept(300);
    }

    // 제외키워드(column:exception_keyword) 고려필요
    // keyword가 있으면 키워드 우선 검색 - (keyword는 없고 product_name만 있으면 제품명으로 찾아보고)

    // 키워드id가져오고나서 야기db product_itemscout_keyword에 keyword_id 넣기

    // 키워드id 별로 가져오기 & 야기DB product_itemscout_data에 넣기로직
  });
};
getYagiProduct(0);
