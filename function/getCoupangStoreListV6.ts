import { getProductTypeV5 } from "../all_update";
import { StoreTypeV5 } from "./updateByItemscout";
import { uniqueId } from "lodash";
import { Builder, By, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { exec } from "child_process";

let driver: WebDriver;
let isChromeRunning = false;

const getHeaders = () => {
  const userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36";
  const chromeOptions = new chrome.Options();
  chromeOptions.debuggerAddress("127.0.0.1:9222");
  chromeOptions.addArguments(`--user-agent=${userAgent}`);
  chromeOptions.addArguments("--lang=ko-KR");

  return chromeOptions;
};

export const getCoupangStoreListV6 = async ({ coupang_keyword }: getProductTypeV5): Promise<StoreTypeV5[]> => {
  if (!coupang_keyword) return [];

  // if (!isChromeRunning) {
  //   exec("/usr/bin/google-chrome --remote-debugging-port=9222");
  //   isChromeRunning = true;
  // }

  driver = await new Builder().forBrowser("chrome").setChromeOptions(getHeaders()).build();
  const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(coupang_keyword)}`;
  await driver.get(url);
  const productElements = await driver.findElements(By.className("search-product-list"));
  console.log({ productElements, isChromeRunning });
  const storeList: StoreTypeV5[] = [];

  for (let element of productElements) {
    const store_product_name = await element.findElement(By.css("dl > dd > div > div.name")).getText();
    const store_product_image_data_src =
      "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("data-img-src"));
    const store_product_image_src = "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("src"));
    const store_product_image =
      store_product_image_src.includes("undefined") || store_product_image_src.includes("blank1x1")
        ? store_product_image_data_src
        : store_product_image_src;
    const store_link = "https://www.coupang.com" + (await element.getAttribute("href"));
    const store_price = Number(
      (await element.findElement(By.css("dl > dd > div > div.price-area > div > div.price > em > strong")).getText())
        .trim()
        .replace(/,/g, "")
    );
    const typeSrc = await element
      .findElement(By.css("dl > dd > div > div.price-area > div > div.price > em > span > img"))
      .getAttribute("src");
    const outOfStock = await element.findElement(By.css("dl > dd > div > div.price-area > div.out-of-stock")).getText();
    const type = !typeSrc
      ? null
      : typeSrc.includes("merchant")
      ? "제트배송"
      : typeSrc.includes("fresh")
      ? "로켓프레시"
      : typeSrc.includes("global")
      ? "로켓직구"
      : typeSrc.includes("rocket")
      ? "로켓배송"
      : null;
    const store_review_score = Number(
      await element.findElement(By.css("dl > dd > div > div.other-info > div > span.star > em")).getText()
    );
    const store_review_count = Number(
      (await element.findElement(By.css("dl > dd > div > div.other-info > div > span.rating-total-count")).getText())
        .trim()
        .replace(/\(|\)/g, "")
    );
    const is_ad = (await element.findElement(By.css("dl > dd > div > span > span.ad-badge-text")).getText()) === "AD";
    if (!type || is_ad || !store_product_image || outOfStock === "일시품절") continue;
    const data = {
      yagi_keyword: coupang_keyword,
      origin_product_name: store_product_name,
      product_image: store_product_image,
      mall_image: null,
      price: store_price,
      delivery: 0,
      store_name: type,
      category: null,
      review_count: store_review_count,
      review_score: store_review_score,
      is_naver_shop: false,
      is_oversea: type === "로켓직구",
      store_link,
    };
    storeList.push(data);
  }
  return storeList;
};

type CoupangDataType = {
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
};
