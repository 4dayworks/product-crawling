import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { wrapSlept } from "./function/wrapSlept";
import { l } from "./function/console";
import { getBrandURLList } from "./function/iherb/brandList";
import { getMaxPageList } from "./function/iherb/getMaxPageList";
import { getProductListData } from "./function/iherb/getProductListData";
import { getProductDescData } from "./function/iherb/getProductDescData";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// # 제품의 상세정보를 가져옵니다. 예) 랭킹, 상품정보, 주의사항 등
// # 제품의 가격정보를 가져오려면 product_price_update_iherb.ts를 사용하세요.
// # 크롤링 봇 차단 될 수 있음.
//  크롤링 봇으로 판단해 IP를 차단하므로 수동체크가 반드시 필요합니다. -> 주기적으로 돌리는 자동화 불가능, 오류 확인을 위해 localhost로 돌리는 것을 권장함
const brandAddIherb = async (brandURLList: string[]) => {
  // # (2) 브랜드 별로 반복 //default: brandIndex = 0
  for (let brandIndex = 0; brandIndex < brandURLList.length; brandIndex++) {
    l(
      `[${brandIndex + 1}/${brandURLList.length + 1}]`,
      "blue",
      `next brand !, start_at: ${new Date().toISOString()}, brand-url: ${brandURLList[brandIndex]}`
    );
    const maxPage = await getMaxPageList(brandURLList[brandIndex]);
    await wrapSlept(1000);
    if (maxPage.maxPage === null) return;

    // # (3) 브랜드 페이지 안에 있는 각 페이지별로 반복 //default: page = 1
    for (let page = 1; page <= maxPage.maxPage; page++) {
      const productURLList = await getProductListData(`${maxPage.list_url}?p=${page}`);
      l(
        `[${page}/${maxPage.maxPage}]`,
        "green",
        `next page !, start_at: ${new Date().toISOString()}, page-url: ${maxPage.list_url}?p=${page}`
      );
      await wrapSlept(1000);

      // # (4) 각 제품별로 제품 상세에 들어가 상세 정보 페이지 크롤링 //default: i = 0
      for (let i = 0; i < productURLList.length; i++) {
        // if (brandIndex == 2) continue;
        // if (brandIndex == 4 && page == 3) continue;
        // if (brandIndex == 4 && page == 7 && i < 18) continue;
        const product = productURLList[i];
        const start_at = new Date();
        l(
          `[${i + 1}/${productURLList.length}]`,
          "cyan",
          `product_id: ${product.product_url
            .slice(product.product_url.lastIndexOf("/") + 1, product.product_url.length)
            .padStart(6, " ")}, start_at: ${start_at.toISOString()}`
        );
        await getProductDescData(product);
        const end_at = new Date();
        const wait_time = start_at.getTime() + 200 - end_at.getTime();
        if (wait_time > 0) await wrapSlept(wait_time);
      }
    }
  }
  l("[DONE]", "green", "complete - iherb all product price update");
};

// # (1) 브랜드 리스트 가져오기
const brandURLList = getBrandURLList["active"];
brandAddIherb(brandURLList);
