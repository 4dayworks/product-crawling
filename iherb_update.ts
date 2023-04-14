import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { getBrandURLList, getMaxPageList, getProductData, getProductListData } from "./function/updateByIherb";
import { wrapSlept } from "./function/wrapSlept";
import { l } from "./function/console";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateIherb = async (product_id_list?: number[]) => {
  // # (1) 브랜드 리스트 가져오기
  const brandURLList = getBrandURLList["active"];

  // # (2) 제품목록의 페이지별로 반복
  for (let brandIndex = 0; brandIndex < brandURLList.length; brandIndex++) {
    l(
      `[${brandIndex + 1}/${brandURLList.length + 1}]`,
      "blue",
      `next brand !, start_at: ${new Date().toISOString()}, brand-url: ${brandURLList[brandIndex]}`
    );
    const maxPage = await getMaxPageList(brandURLList[brandIndex]);
    if (maxPage.maxPage === null) return;
    for (let page = 1; page <= maxPage.maxPage; page++) {
      const productURLList = await getProductListData(`${maxPage.list_url}?p=${page}`);
      l(
        `[${page}/${maxPage.maxPage}]`,
        "green",
        `next page !, start_at: ${new Date().toISOString()}, page-url: ${maxPage.list_url}?p=${page}`
      );
      for (let i = 0; i < productURLList.length; i++) {
        if (page === 1 && i < 46) continue;
        const product = productURLList[i];
        const start_at = new Date();
        l(
          `[${i + 1}/${productURLList.length}]`,
          "cyan",
          `product_id: ${product.product_url.slice(
            product.product_url.lastIndexOf("/") + 1,
            product.product_url.length
          )}, start_at: ${start_at.toISOString()}`
        );
        await getProductData(product);
        const end_at = new Date();
        const wait_time = start_at.getTime() + 5000 - end_at.getTime();
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
