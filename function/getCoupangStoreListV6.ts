import { getProductTypeV5 } from "../all_update";
import { StoreTypeV5 } from "./updateByItemscout";

import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export const getCoupangStoreListV6 = async ({ coupang_keyword }: getProductTypeV5): Promise<StoreTypeV5[]> => {
  if (!coupang_keyword) return [];
  let driver;

  try {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments("--headless");
    chromeOptions.addArguments("--no-sandbox");
    chromeOptions.addArguments("--disable-dev-shm-usage");

    driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();

    const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(coupang_keyword)}`;
    await driver.get(url);

    const productElements = await driver.findElements(By.css("ul.search-product-link"));
    const storeList: StoreTypeV5[] = [];

    console.log({ url, productElements });
    for (let element of productElements) {
      const store_product_name = await element.findElement(By.css("dl > dd > div > div.name")).getText();

      const store_product_image_data_src =
        "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("data-img-src"));
      const store_product_image_src =
        "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("src"));

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
      const outOfStock = await element
        .findElement(By.css("dl > dd > div > div.price-area > div.out-of-stock"))
        .getText();

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
  } catch (error) {
    console.error("Error in web scraping:", error);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
};

type CoupangDataType = {
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
};
