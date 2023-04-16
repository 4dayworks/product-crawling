import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { getMaxPageList, getProductDescData, getProductListData, getProductPriceData } from "./function/updateByIherb";
import { wrapSlept } from "./function/wrapSlept";
import { l } from "./function/console";
import { getBrandURLList } from "./function/iherb/brandList";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// 판매처 집어넣고 최저가 반환하는 함수 -> 네이버/아이템스카우트 크롤링때 사용
// const updateIherbByproductUrl =async () => {
//   await getProductData({
//     list_url: "https://kr.iherb.com/c/21st-century-health-care?p=3",
//     product_url: "https://kr.iherb.com/pr/21st-century-wellify-men-s-50-multivitamin-multimineral-65-tablets/83157",
//     brand: "21st Century (21st 센추리)",
//   });
// }

// # (1)가격은 getProductPriceData 사용해서 가져오고(REST API 사용),
// # (2)제품의 상세 데이터는 getProductDescData를 통해 가져옴(페이지 크롤링)
// (2)는 iherb 데이터를 크롤링 봇으로 판단해 IP 막으므로 수동체크 반드시 필요. -> 주기적으로 돌리는 자동화 불가능
const updateIherb = async (isInitProduct = false) => {
  // # (1) 브랜드 리스트 가져오기
  const brandURLList = getBrandURLList["active"];

  // # (2) 제품목록의 페이지별로 반복
  // # 메인로직
  for (let brandIndex = 0; brandIndex < brandURLList.length; brandIndex++) {
    //default: brandIndex = 0
    l(
      `[${brandIndex + 1}/${brandURLList.length + 1}]`,
      "blue",
      `next brand !, start_at: ${new Date().toISOString()}, brand-url: ${brandURLList[brandIndex]}`
    );

    const maxPage = await getMaxPageList(brandURLList[brandIndex]);
    await wrapSlept(1000);

    if (maxPage.maxPage === null) return;
    for (let page = 1; page <= maxPage.maxPage; page++) {
      //default: page = 1
      const productURLList = await getProductListData(`${maxPage.list_url}?p=${page}`);
      l(
        `[${page}/${maxPage.maxPage}]`,
        "green",
        `next page !, start_at: ${new Date().toISOString()}, page-url: ${maxPage.list_url}?p=${page}`
      );
      await wrapSlept(1000);

      for (let i = 0; i < productURLList.length; i++) {
        //default: i = 0
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
        if (isInitProduct) await getProductDescData(product);
        else await getProductPriceData(product);
        const end_at = new Date();
        const wait_time = start_at.getTime() + 200 - end_at.getTime();
        if (wait_time > 0) await wrapSlept(wait_time);
      }
    }
  }
  l("[DONE]", "green", "complete - iherb all product price update");
};

// updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateByProductId(Array.from({ length: 100 }).map((a, i) => i + 1));
updateIherb();

export type productURLDataType = {
  list_url: string;
  product_url: string;
  brand: string;
};
