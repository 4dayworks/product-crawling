import puppeteer, { Page } from "puppeteer";
import { StoreType } from "../../camp/types/craw";

export default async function getNatverStoreList({ keyword }: { keyword: string | null }): Promise<StoreType[]> {
  if (!keyword) return [];
  const query = keyword.replace(/ /g, "+");
  const url = `https://search.shopping.naver.com/search/all?pagingIndex=1&pagingSize=40&productSet=total&query=${query}&sort=rel&timestamp=&viewType=list`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // 대상 요소가 나타날 때까지 대기
  await page.waitForSelector("div#content");

  // 페이지 끝까지 스크롤 다운하여 모든 목록 로드
  await autoScroll(page);

  // 페이지 내 제품 정보 추출
  const productList = await page.evaluate((): StoreType[] => {
    const productItems = Array.from(document.querySelectorAll<HTMLDivElement>(".product_item__MDtDF"));
    return productItems.map((div): StoreType => {
      // 각 요소의 상세 정보를 추출
      const getDetail = (selector: string, attr?: string): string => {
        const element = div.querySelector(selector);
        if (!element) return "";
        return attr ? (element as HTMLImageElement).getAttribute(attr) || "" : element.textContent || "";
      };
      const product_image = getDetail(".thumbnail_thumb_wrap__RbcYO img", "src");
      const origin_product_name = getDetail(".product_title__Mmw2K a");
      const delivery = Number(getDetail(".price_delivery__yw_We").replace(/\D/g, ""));
      const price = Number(getDetail(".product_price__52oO9 .price_num__S2p_v em").replace(/\D/g, ""));
      const category = Array.from(div.querySelectorAll(".product_category__l4FWz"))
        .map((cat) => cat.textContent)
        .join(">");
      const sellerNameElement = div.querySelector(".product_mall_title__Xer1m a");
      const store_name =
        sellerNameElement?.textContent?.trim() ||
        sellerNameElement?.querySelector("img")?.getAttribute("alt")?.trim() ||
        "";
      const is_naver_shop = store_name === "브랜드 카탈로그" || !!sellerNameElement?.textContent?.trim();

      const store_link = getDetail(".product_link__TrAac", "href"); // 구매 링크 추출
      // 해외 구매 여부 판단
      const overseaButton = div.querySelector(".product_title__Mmw2K .ad_label__2bKRj");
      const is_oversea = (overseaButton && overseaButton?.textContent?.includes("해외")) || false;

      return {
        camp_keyword: null,
        origin_product_name,
        product_image,
        mall_image: null,
        price,
        delivery,
        store_name,
        category,
        review_count: null,
        review_score: null,
        is_naver_shop,
        is_oversea,
        store_link,
        apiType: "naver",
      };
    });
  });

  await browser.close();

  return productList.map((i) => ({ ...i, camp_keyword: keyword }));
}

// 페이지 끝까지 자동으로 스크롤하는 함수
async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, reject) => {
      var totalHeight = 0;
      var distance = 500;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

// 크롤링 함수 실행

// const test = async () => {
//   while (true) {
//     const start = new Date();
//     await getNatverStoreList({ keyword: "히알루론산 해외" }).then((storeList) => {
//       const end = new Date();
//       console.log(
//         `${start.getDate() + "일" + start.getHours() + "시" + start.getMinutes() + "분" + start.getSeconds() + "초"}`,
//         (end.getTime() - start.getTime()) / 1000,
//         "초걸림!, 가져온갯수:",
//         storeList.length,
//         storeList
//       );
//     });
//   }
// };
// test();