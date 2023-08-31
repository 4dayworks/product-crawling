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
    // User-Agent를 일반적인 최신 웹 브라우저의 User-Agent로 설정
    chromeOptions.addArguments(
      `--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`
    );
    // 리퍼러를 쿠팡의 메인 페이지로 설정 (크롤링 대상 페이지에 진입하는 것처럼 흉내)
    chromeOptions.addArguments("--referer=https://www.coupang.com/");
    chromeOptions.addArguments(
      "--cookies-file=sid=110094e394f84c79a22dc0e0ca3b25615323625e; PCID=45440554965327675751181; overrideAbTestGroup=%5B%5D; MARKETID=45440554965327675751181; x-coupang-accept-language=ko-KR; x-coupang-target-market=KR; bm_sz=053F1776BE1D9FDFB05880B164FD4536~YAAQxnkyF/LdYEaKAQAABm4YSRRn5vJe5XwiqjtFu2LNMbvzpQfhTzIfWIlWcEN+k3jAauzCtxzisjPU3LqCUMJKewuwX82bQdNQQVhySx4Y/UX3iEujSxR3wG+z1TT5i+rOrcuFgGQxjtYxlweJEHXPIAYDgo6IpO37jug7+MQoQfSAWaJ97R4+jMlm27lkRouiVD12xcpouTLW6YuhNdwD9cWPF6cI04Qz/GhCbZUXVUDUPuIWT0ebpxWNPHjPKoc3XLJnxvaUEbYbBWcbuleR32Dd2rsbYiHPhXCrJzOD34fv~3686968~3160377; _fbp=fb.1.1693443452926.27849966; bm_mi=EC1D889295B5EC5AD183EEDA658501E4~YAAQxnkyF4jrYEaKAQAAOHoYSRTAHCoEVNxR339SIR1/bHdzJB3JQ5jDBjNew3VTpBfjePCeVbg/SzMNIgMObQ4xcrpavez4B2/kmXzwYxc8yUGpKNrT+OiuAkyXbgZ42amsFLabNfUuA5DyQgFcRWJ/ULZP9sbDz/pYMqFK8XCDUK7HmUaYcY8/qfyOXntoEgLyBH9PiSNvbl5/Zzem3UVjmF8chS9Pg7/yRitTR04/pxrG7Qyo7/Wb3UeuAjprGJnVVGvUN4EGIJvSm4+Zl8mNXn+YAy2gdbKkmxT/ouT4HO4ueWDo8UdEo6FE9XO6lAItq91vydA=~1; ak_bmsc=D62038A759E7721342B6E19C7B35499D~000000000000000000000000000000~YAAQxnkyF3fuYEaKAQAAyn0YSRSgqtRAvi3rYNvQl0OU1M9lVZClHDe6JEFCmpqFlWihZk1BcVXCWKsa5J8hiiKGZ+7zXy+x4v719lnBvbjuh+VvT2Fsb30nlZyi6WkBjZdcT7fGt+ZuB2OJk+N9WDGsmHHPbQ39YWeEf6NGUMlg/t2tbs/TSRMfPz4W/RxASOwjTQJezugJa5lZu/hV9wyqlbTyI+FthSD7EkYdIBZtZllOvJSEnpmj+p/y6eUbD7C9wr6UcVxuWz8tgsOIE4FRaLziotyYz94WustAupxqcYCp/7WYGAIzw9fzAoVdkOEOqC5+QlZg6tQ4ouWTP4mu/GM7HPyaC3kD8/VgiW/1DKrPqc2mKGEsC9CpvROfsJBmYG9+vESgcnt/gb3jFxVh+8sSOSGPMni6G8hXVdNMoAcgpRHXJdI/slphDrVk9WJ1JSIg4mGoT6IetT2x/kgMYM5MKHRbnQDdRol6VDHHDaCWr9SP9K9HPTCvjEox4W1EZ95F0Clocm3LUzGTbtlkCbinWYUf8RHJwB4S; _abck=DDC902C0C5DD81A28D2F4BE7409B6034~0~YAAQxnkyF/9eYkaKAQAAXisaSQrL8m1ufRUiZk0713k2+sKx0NudoUFXxod5xEapV3R1/hP9CjmijpktAPZm2CbvodaRPHFi+xwrCgxgXR5jPosudS7m28L81h9dSbX+UXf3w0yhv6pt9uuE9OY9NwRHhStOuZeq6QchZdyj9FZDMT2DZ812uW51aVSj9dxKtkb+cvQLFPSccD52e/C9ExYvjD56azl8ZsKXU4d/ofZy6lwqCrdWHS04ZHRBy1yU7LPv7TVY5zUDZVsqhBLuKXIWWcWO3gfzeWgTfw3I9FuXLCNHn5UJWPSbc431e6ExdT8mdfngc8trfdxf25As7x9vkjzjgKxOl8AvazqLy2W0/9wHMRY9O3xMulR26nF0ulPuLYXxe4G8b+KD72jb5gj5TkJNmovgtbGT5XG/qZN65E74iiQK~-1~-1~-1; searchKeyword=%EC%9C%8C%EC%BC%80%EC%96%B4%20%ED%94%84%EB%9D%BC%EC%9E%84%20%EB%AA%A8%EB%A1%9C%EC%98%A4%EB%A0%8C%EC%A7%80%20%EC%B6%94%EC%B6%9C%EC%A0%95%7C%EB%8C%80%EC%83%81%EC%9B%B0%EB%9D%BC%EC%9D%B4%ED%94%84%20%EB%A7%88%EC%9D%B4%EB%89%B4%ED%8A%B8%EB%A6%AC%EC%85%98%20%EC%95%84%EB%A5%B4%EA%B8%B0%EB%8B%8C%20%EC%A0%A4%EB%A6%AC%20%EB%B3%B5%EC%88%AD%EC%95%84%EB%A7%9B%7C%EC%9D%B4%EC%B2%98%EC%8A%A4%ED%83%91%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84%20%EC%9C%A0%EC%B9%BC%EB%A6%BD%ED%88%AC%EC%8A%A4%20%ED%94%84%EB%A1%9C%ED%8F%B4%EB%A6%AC%EC%8A%A4%205000%7C%EB%84%A4%EC%B8%84%EB%A0%90%EB%A1%9C%20%ED%99%80%ED%91%B8%EB%93%9C%20%EB%A9%80%ED%8B%B0%EB%B9%84%ED%83%80%EB%AF%BC%20%ED%8F%AC%20%EB%A7%A8%7C%ED%93%A8%EC%96%B4%EC%9D%B8%EC%BA%A1%EC%8A%90%EB%A0%88%EC%9D%B4%EC%85%98%20%EB%B9%84%ED%83%80%EB%AF%BC%20D3%20125mcg; searchKeywordType=%7B%22%EC%9C%8C%EC%BC%80%EC%96%B4%20%ED%94%84%EB%9D%BC%EC%9E%84%20%EB%AA%A8%EB%A1%9C%EC%98%A4%EB%A0%8C%EC%A7%80%20%EC%B6%94%EC%B6%9C%EC%A0%95%22%3A0%7D%7C%7B%22%EB%8C%80%EC%83%81%EC%9B%B0%EB%9D%BC%EC%9D%B4%ED%94%84%20%EB%A7%88%EC%9D%B4%EB%89%B4%ED%8A%B8%EB%A6%AC%EC%85%98%20%EC%95%84%EB%A5%B4%EA%B8%B0%EB%8B%8C%20%EC%A0%A4%EB%A6%AC%20%EB%B3%B5%EC%88%AD%EC%95%84%EB%A7%9B%22%3A0%7D%7C%7B%22%EC%9D%B4%EC%B2%98%EC%8A%A4%ED%83%91%20%ED%94%84%EB%A6%AC%EB%AF%B8%EC%97%84%20%EC%9C%A0%EC%B9%BC%EB%A6%BD%ED%88%AC%EC%8A%A4%20%ED%94%84%EB%A1%9C%ED%8F%B4%EB%A6%AC%EC%8A%A4%205000%22%3A0%7D%7C%7B%22%EB%84%A4%EC%B8%84%EB%A0%90%EB%A1%9C%20%ED%99%80%ED%91%B8%EB%93%9C%20%EB%A9%80%ED%8B%B0%EB%B9%84%ED%83%80%EB%AF%BC%20%ED%8F%AC%20%EB%A7%A8%22%3A0%7D%7C%7B%22%ED%93%A8%EC%96%B4%EC%9D%B8%EC%BA%A1%EC%8A%90%EB%A0%88%EC%9D%B4%EC%85%98%20%EB%B9%84%ED%83%80%EB%AF%BC%20D3%20125mcg%22%3A0%7D; bm_sv=0B71EA109FE66DAD1A7856B00984C559~YAAQX3XTF+TZqEOKAQAAuEYdSRQdkSAE1yDn55ShItBYhodmAa7Ky9uM1Q1IthXTc4m6eYxfIF86YLg7yebFaW3oPZDx1W9UtCMPpcLAuw/WA0Y3ZmqRq6Rz3dqxL3oTNbYavbp5Lko55rN4zGWenV4DITlBkTb+u91L9v8GVC9PJBQcXmfpHAIUshy8GJqziHd4ux17kW1NKts/PTUW59TDzm9PDkcEuxW+p0V1/aaE4+e3ee6iEdbpX2VMfBXMEB8=~1; cto_bundle=pjXVv180S216OXB5VEolMkJ1c2cyNWNiRzdWSktHcUtXVG1ISEd2cHhPQiUyRm1FelM2M2tyTU91WFZ3TklLeSUyQnNqaWMyNktnZlY2U3R1WHlqcWs4azVzQXgxbG9tb1c1c2RYMGZZekclMkZDUVhiUVQyVnR3cTElMkJMN3Ztc0NkSXZmc2szd0N1b2hVdGIxJTJGdm5HdUNhV0FNMDV0NG82WEElM0QlM0Q; baby-isWide=small"
    ); // 쿠키 파일 경로 (선택적)

    driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();

    const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(coupang_keyword)}`;
    await driver.get(url);

    const bodyContent = await driver.findElement(By.tagName("body")).getAttribute("outerHTML");
    console.log({ bodyContent });

    const productElements = await driver.findElements(By.css("a.search-product-link"));
    const storeList: StoreTypeV5[] = [];

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
