import { getProductTypeV5 } from "../all_update";
import { StoreTypeV5 } from "./updateByItemscout";

import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

export const getCoupangStoreListV6 = async ({ coupang_keyword }: getProductTypeV5): Promise<StoreTypeV5[]> => {
  if (!coupang_keyword) return [];
  let driver;

  try {
    // 리퍼러를 쿠팡의 메인 페이지로 설정 (크롤링 대상 페이지에 진입하는 것처럼 흉내)
    // chromeOptions.addArguments("--referer=https://www.coupang.com/");

    const proxies = [
      { ip: "20.33.5.27", port: 8888 },
      { ip: "95.174.64.126", port: 3128 },
      { ip: "144.49.99.180", port: 8080 },
      { ip: "147.124.215.199", port: 8080 },
      { ip: "20.219.177.73", port: 3129 },
      { ip: "144.49.99.170", port: 8080 },
      { ip: "20.204.212.45", port: 3129 },
      { ip: "20.219.177.38", port: 3129 },
      { ip: "103.153.127.8", port: 8080 },
      { ip: "45.152.188.241", port: 3128 },
      { ip: "20.219.183.188", port: 3129 },
      { ip: "144.49.99.216", port: 8080 },
      { ip: "20.219.235.172", port: 3129 },
      { ip: "41.65.236.43", port: 1981 },
      { ip: "213.230.107.235", port: 8080 },
      { ip: "5.254.34.51", port: 3129 },
      { ip: "34.87.130.22", port: 8080 },
      { ip: "20.219.176.57", port: 3129 },
      { ip: "20.219.177.85", port: 3129 },
      { ip: "37.58.150.207", port: 3129 },
      { ip: "144.49.99.214", port: 8080 },
      { ip: "144.49.99.17", port: 8080 },
      { ip: "20.204.190.254", port: 3129 },
      { ip: "20.204.214.79", port: 3129 },
      { ip: "144.49.99.19", port: 8080 },
      { ip: "20.44.206.138", port: 80 },
      { ip: "20.204.212.76", port: 3129 },
      { ip: "103.249.62.1", port: 4443 },
      { ip: "186.121.235.222", port: 8080 },
      { ip: "20.219.180.149", port: 3129 },
      { ip: "64.225.8.135", port: 10000 },
      { ip: "209.79.65.132", port: 8080 },
      { ip: "8.219.97.248", port: 80 },
      { ip: "5.165.6.188", port: 1513 },
      { ip: "20.219.180.105", port: 3129 },
      { ip: "144.49.99.18", port: 8080 },
      { ip: "35.236.207.242", port: 33333 },
      { ip: "36.90.106.26", port: 3128 },
      { ip: "8.209.114.72", port: 3129 },
      { ip: "117.251.103.186", port: 8080 },
      { ip: "20.84.106.205", port: 8214 },
      { ip: "54.207.245.159", port: 80 },
      { ip: "148.251.162.83", port: 80 },
      { ip: "144.49.99.190", port: 8080 },
      { ip: "34.154.161.152", port: 80 },
      { ip: "213.136.101.37", port: 3128 },
      { ip: "103.169.131.11", port: 8080 },
      { ip: "185.191.236.162", port: 3128 },
      { ip: "198.251.72.26", port: 80 },
      { ip: "5.180.44.150", port: 8080 },
      { ip: "213.136.101.36", port: 3128 },
      { ip: "222.109.192.34", port: 8080 },
      { ip: "64.225.8.118", port: 10000 },
      { ip: "113.161.93.29", port: 8080 },
      { ip: "51.159.115.233", port: 3128 },
      { ip: "64.226.96.157", port: 9300 },
      { ip: "144.49.99.215", port: 8080 },
      { ip: "179.96.28.58", port: 80 },
      { ip: "200.7.8.74", port: 8080 },
      { ip: "5.161.82.73", port: 3128 },
      { ip: "20.106.146.212", port: 5001 },
      { ip: "64.225.8.142", port: 10000 },
      { ip: "50.222.34.43", port: 60808 },
      { ip: "163.15.183.33", port: 3128 },
      { ip: "154.79.248.44", port: 32650 },
      { ip: "115.96.208.124", port: 8080 },
      { ip: "164.52.206.180", port: 80 },
      { ip: "3.16.22.118", port: 3128 },
      { ip: "20.204.214.23", port: 3129 },
      { ip: "186.195.254.130", port: 53281 },
      { ip: "36.91.98.115", port: 8181 },
      { ip: "191.179.216.84", port: 8080 },
      { ip: "47.253.105.175", port: 20002 },
      { ip: "45.181.123.97", port: 999 },
      { ip: "95.216.114.142", port: 80 },
      { ip: "91.238.211.110", port: 8080 },
      { ip: "185.213.23.71", port: 3999 },
      { ip: "200.110.173.17", port: 999 },
      { ip: "154.236.191.44", port: 1981 },
      { ip: "200.106.184.15", port: 999 },
      { ip: "45.167.124.229", port: 999 },
      { ip: "177.37.16.227", port: 8080 },
      { ip: "104.171.112.125", port: 80 },
      { ip: "156.200.116.69", port: 1976 },
      { ip: "103.22.217.21", port: 8080 },
      { ip: "177.93.46.188", port: 999 },
      { ip: "201.182.251.140", port: 999 },
      { ip: "116.0.61.122", port: 3128 },
      { ip: "154.236.191.51", port: 1976 },
      { ip: "170.233.193.129", port: 999 },
      { ip: "45.6.100.10", port: 80 },
      { ip: "38.156.233.75", port: 999 },
      { ip: "76.80.116.106", port: 8080 },
      { ip: "179.1.66.66", port: 8080 },
    ];

    for (let i = 3 + 4; i < proxies.length - 1; i++) {
      const chromeOptions = new chrome.Options();
      chromeOptions.addArguments("--headless");
      chromeOptions.addArguments("--no-sandbox");
      chromeOptions.addArguments("--disable-dev-shm-usage");
      // User-Agent를 일반적인 최신 웹 브라우저의 User-Agent로 설정
      chromeOptions.addArguments(
        `--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`
      );
      chromeOptions.addArguments(`--proxy-server=http://${proxies[i].ip}:${proxies[i].port}`);

      const driver = await new Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build();

      const url = `https://www.coupang.com/np/search?rocketAll=true&q=${encodeURIComponent(coupang_keyword)}`;
      await driver.get(url);

      const bodyContent = await driver.findElement(By.tagName("body")).getAttribute("outerHTML");
      console.log({ bodyContent });
    }

    // const productElements = await driver.findElements(By.css("a.search-product-link"));
    // const storeList: StoreTypeV5[] = [];

    // for (let element of productElements) {
    //   const store_product_name = await element.findElement(By.css("dl > dd > div > div.name")).getText();

    //   const store_product_image_data_src =
    //     "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("data-img-src"));
    //   const store_product_image_src =
    //     "https:" + (await element.findElement(By.css("dl > dt > img")).getAttribute("src"));

    //   const store_product_image =
    //     store_product_image_src.includes("undefined") || store_product_image_src.includes("blank1x1")
    //       ? store_product_image_data_src
    //       : store_product_image_src;

    //   const store_link = "https://www.coupang.com" + (await element.getAttribute("href"));

    //   const store_price = Number(
    //     (await element.findElement(By.css("dl > dd > div > div.price-area > div > div.price > em > strong")).getText())
    //       .trim()
    //       .replace(/,/g, "")
    //   );

    //   const typeSrc = await element
    //     .findElement(By.css("dl > dd > div > div.price-area > div > div.price > em > span > img"))
    //     .getAttribute("src");
    //   const outOfStock = await element
    //     .findElement(By.css("dl > dd > div > div.price-area > div.out-of-stock"))
    //     .getText();

    //   const type = !typeSrc
    //     ? null
    //     : typeSrc.includes("merchant")
    //     ? "제트배송"
    //     : typeSrc.includes("fresh")
    //     ? "로켓프레시"
    //     : typeSrc.includes("global")
    //     ? "로켓직구"
    //     : typeSrc.includes("rocket")
    //     ? "로켓배송"
    //     : null;

    //   const store_review_score = Number(
    //     await element.findElement(By.css("dl > dd > div > div.other-info > div > span.star > em")).getText()
    //   );

    //   const store_review_count = Number(
    //     (await element.findElement(By.css("dl > dd > div > div.other-info > div > span.rating-total-count")).getText())
    //       .trim()
    //       .replace(/\(|\)/g, "")
    //   );

    //   const is_ad = (await element.findElement(By.css("dl > dd > div > span > span.ad-badge-text")).getText()) === "AD";

    //   if (!type || is_ad || !store_product_image || outOfStock === "일시품절") continue;

    //   const data = {
    //     yagi_keyword: coupang_keyword,
    //     origin_product_name: store_product_name,
    //     product_image: store_product_image,
    //     mall_image: null,
    //     price: store_price,
    //     delivery: 0,
    //     store_name: type,
    //     category: null,
    //     review_count: store_review_count,
    //     review_score: store_review_score,
    //     is_naver_shop: false,
    //     is_oversea: type === "로켓직구",
    //     store_link,
    //   };

    //   storeList.push(data);
    // }

    // return storeList;
    return [];
  } catch (error) {
    console.error("Error in web scraping:", error);
    throw error;
  } finally {
    if (driver) {
      // await driver.quit();
    }
  }
};
