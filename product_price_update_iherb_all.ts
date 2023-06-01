import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { l } from "./function/console";
import { getMaxPageList } from "./function/iherb/getMaxPageList";
import { getProductListData } from "./function/iherb/getProductListData";
import { getIherbStoreList } from "./function/getIherbStoreList";
import { wrapSlept } from "./function/wrapSlept";
import { getBrandURLList } from "./function/iherb/brandList";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// // 판매처 집어넣고 최저가 반환하는 함수 -> 네이버/아이템스카우트 크롤링때 사용
// const updateIherbByproductUrl = async () => {
//   await getProductPriceData({
//     list_url: "",
//     product_url: "https://kr.iherb.com/pr/nature-s-way-probiotic-pearls-immune-regularity-immunity-30-softgels/10551",
//     brand: "",
//   });
// };

// # 제품의 가격을 가져옵니다. 2600개 기준 약 48분 소요.
// # 제품의 상세정보 예) 랭킹, 상품정보, 주의사항 등은 가져올 수 없습니다.
// # 제품의 상세정보를 가져오려면 product_brand_add_iherb.ts를 사용하세요.
const priceUpdateIherb = async (brandURLList: string[]) => {
  // # (2) 브랜드 별로 반복 //default: brandIndex = 0
  for (let brandIndex = 0; brandIndex < brandURLList.length; brandIndex++) {
    /*START***************************************************************************** */
    const maxPage = await getMaxPageList(brandURLList[brandIndex]);

    const text = `next brand !, start_at: ${new Date().toISOString()}, brand-url: ${brandURLList[brandIndex]}`;
    l(`[${brandIndex + 1}/${brandURLList.length}]`, "blue", text);

    await wrapSlept(1000);
    /*END******************************************************************************* */
    if (maxPage.maxPage === null) return;
    // # (3) 브랜드 페이지 안에 있는 각 페이지별로 반복 //default: page = 1
    for (let page = 1; page <= maxPage.maxPage; page++) {
      /*START***************************************************************************** */
      const productURLList = await getProductListData(`${maxPage.list_url}?p=${page}`);

      const text = `next page !, start_at: ${new Date().toISOString()}, page-url: ${maxPage.list_url}?p=${page}`;
      l(`[${page}/${maxPage.maxPage}]`, "green", text);

      await wrapSlept(1000);
      /*END******************************************************************************* */
      // # (4) 각 제품별로 제품 상세에 들어가 상세 정보 페이지 크롤링 //default: i = 0
      for (let i = 0; i < productURLList.length; i++) {
        // if (brandIndex == 2) continue;
        // if (brandIndex == 4 && page == 3) continue;
        // if (brandIndex == 4 && page == 7 && i < 18) continue;
        /*START***************************************************************************** */
        const product = productURLList[i];
        await getIherbStoreList(product);

        const start_at = new Date();
        const text = `iherb_product_id: ${product.product_url
          .slice(product.product_url.lastIndexOf("/") + 1, product.product_url.length)
          .padStart(6, " ")}, start_at: ${start_at.toISOString()}`;
        l(`[${i + 1}/${productURLList.length}]`, "cyan", text);

        const end_at = new Date();
        const wait_time = start_at.getTime() + 200 - end_at.getTime();
        if (wait_time > 0) await wrapSlept(wait_time);
        /*END******************************************************************************* */
      }
    }
  }
  l("[DONE]", "green", "complete - iherb all product price update");
};

// # (1) 브랜드 리스트 가져오기
priceUpdateIherb(getBrandURLList["active"]);
