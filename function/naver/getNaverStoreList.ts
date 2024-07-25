import axios from "axios";
import puppeteer, { Page } from "puppeteer";
import { StoreType } from "../types/craw";
import { getUserAgent } from "./getUserAgent";

// 사용자 에이전트 리스트 중 하나를 랜덤으로 선택하는 로직 추가

export default async function getNaverStoreList({ keyword }: { keyword: string | null }): Promise<StoreType[]> {
  if (!keyword) return [];
  const query = keyword.replace(/ /g, "+");
  const url = `https://search.shopping.naver.com/search/all?pagingIndex=1&pagingSize=40&productSet=total&query=${query}&sort=rel&timestamp=&viewType=list`;

  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ headless: "shell" });
  const page = await browser.newPage();
  const userAgentString = getUserAgent();
  await page.setViewport({ width: 1280, height: 800 });

  await page.setUserAgent(userAgentString);
  // 기타 필요한 헤더 추가
  await page.setExtraHTTPHeaders({
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "en-US,en;q=0.9",
  });

  await page.goto(url);

  // 최대 재시도 횟수 설정
  const maxRetries = 10;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // 대상 요소가 나타날 때까지 대기
      await page.waitForSelector("div#content", { timeout: 3000 });
      console.log("Selector found. Proceeding with data extraction.");
      // 데이터 추출 로직 여기에 추가
      break; // 성공하면 반복 중단
    } catch (error) {
      // 새로운 사용자 에이전트로 업데이트하고 페이지 새로 고침
      const userAgentString = getUserAgent();
      await page.setUserAgent(userAgentString);
      await page.reload();
    }
  }

  if (!(await page.$("div#content"))) {
    console.log("Failed to load the content after maximum retries. Exiting...");
    await browser.close();
    return []; // 최대 시도 후 실패 시 빈 배열 반환
  }

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
        apiType: "itemscout-naver",
      };
    });
  });

  await browser.close();

  // axios.get 요청을 병렬로 처리
  const list: StoreType[] = await Promise.all(
    productList.map(async (i, index) => {
      if (!i.store_link || !i.store_link.includes("https://cr.shopping.naver.com/adcr.nhn"))
        return { ...i, camp_keyword: keyword };
      const location = await axios
        .get(i.store_link, {
          maxRedirects: 5,
          headers: {
            "Content-Type": "application/json",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
            "Accept-Encoding": "deflate, br",
          },
          validateStatus: () => true,
        })
        .then(async (r) => {
          let url = r.request.res.responseUrl;

          if (url.includes("https://cr.shoppin")) {
            const htmlContent = r.data;
            const regex = /var targetUrl = "(.*?)";/g;
            const match = regex.exec(htmlContent);
            url = match ? match[1] : url;
          }

          if (url.includes("https://cr.shoppin")) {
            // console.log(i.store_link.slice(0, 20), url.slice(0, 20));

            const body = await axios
              .get(url, {
                maxRedirects: 5,
                headers: {
                  "Content-Type": "application/json",
                  "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
                  "Accept-Encoding": "deflate, br",
                },
                validateStatus: () => true,
              })
              .catch(() => ({ data: null }));

            const htmlContent = body.data;
            const regex = /var targetUrl = "(.*?)";/g;
            const match = regex.exec(htmlContent);
            return match ? match[1] : i.store_link || null;
          } else {
            return url || i.store_link || null;
          }
        });

      // console.log(i.store_link.slice(0, 20), location.slice(0, 20));

      i.store_link = location || i.store_link || null;

      return { ...i, camp_keyword: keyword, store_link: i.store_link };
    })
  );

  //가격으로 필터링
  return list.filter((i) => i.price && i.price > 0);
}

// 페이지 끝까지 자동으로 스크롤하는 함수
async function autoScroll(page: Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      var totalHeight = 0;
      var distance = 200; // 스크롤할 픽셀 단위
      var timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= document.body.scrollHeight) {
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
//     const responseComplete = await getNaverStoreList({ keyword: "제로그램 엘찰텐 제로본" })
//       .then((storeList) => {
//         const end = new Date();
//         console.log(
//           `${start.getDate() + "일" + start.getHours() + "시" + start.getMinutes() + "분" + start.getSeconds() + "초"}`,
//           (end.getTime() - start.getTime()) / 1000,
//           "초걸림!, 가져온갯수:",
//           storeList.length
//         );
//         return true;
//       })
//       .catch(() => false);
//     if (!responseComplete) await wrapSlept(60000); // 실패시 1분대기
//   }
// };
// test();
