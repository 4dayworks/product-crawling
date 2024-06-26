import axios from "axios";
import { AuthorizationKey } from "../function/auth";
import { l } from "../function/console";
import { getMaxPageList } from "../function/iherb/getMaxPageList";
import { getProductDescData } from "../function/iherb/getProductDescData";
import { getProductListData } from "../function/iherb/getProductListData";
import { wrapSlept } from "../function/wrapSlept";
import { getBrandURLList } from "../function/iherb/brandList";
import onTest from "../function/iherb/onTest";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

/**
 * 해외 브랜드 추가시 product_id 제외해야할 것
 * 57847
 */

// # 제품의 상세정보를 가져옵니다. 예) 랭킹, 상품정보, 주의사항 등
// # 제품의 가격정보를 가져오려면 product_price_update_iherb.ts를 사용하세요.
// # 크롤링 봇 차단 될 수 있음.
//  크롤링 봇으로 판단해 IP를 차단하므로 수동체크가 반드시 필요합니다. -> 주기적으로 돌리는 자동화 불가능, 오류 확인을 위해 localhost로 돌리는 것을 권장함
// # 브랜드 추가시 아래쿼리를 통해서 50개를 선별하고 nodejs/src/class/Crawling/productList.ts 에 추가해야 product에 반영됩니다. (현재 TOP 50개만 product/product_show에 들어가게 해놓음.)
// select * from F_DAYWORKS_backup.product_iherb pi2 where iherb_product_brand = "Nature's Way (네이처스 웨이)" order by review_count+0 desc limit 50

const skipProdjct = {
  brandIndex: 1 - 1, //default : 1 - 1
  pageIndex: 1, //default : 1
  productIndex: 1 - 1, //default : 1 - 1
};
const brandAddIherb = async (
  brandURLList: string[],
  testList?: { product_url: string; brand: string; list_url: string }[]
) => {
  if (testList) return onTest(testList);

  l("(주의)", "yellow", "아이허브는 크롤링 봇을 주기적으로 막기떄문에 localhost에서만 실행이 가능합니다.");
  // # (2) 브랜드 별로 반복 //default: brandIndex = 0
  for (let brandIndex = 0; brandIndex < brandURLList.length; brandIndex++) {
    /*START***************************************************************************** */
    // # skip option
    if (brandIndex < skipProdjct.brandIndex) continue;
    const maxPage = await getMaxPageList(brandURLList[brandIndex]);

    const text = `next brand !, start_at: ${new Date().toISOString()}, brand-url: ${brandURLList[brandIndex]}`;
    l(`[${brandIndex + 1}/${brandURLList.length}]`, "blue", text);

    await wrapSlept(1000);
    /*END******************************************************************************* */
    if (maxPage.maxPage === null) return;
    // # (3) 브랜드 페이지 안에 있는 각 페이지별로 반복 //default: page = 1
    for (let page = 1; page <= maxPage.maxPage; page++) {
      /*START***************************************************************************** */
      // # skip option
      if (brandIndex == skipProdjct.brandIndex && page < skipProdjct.pageIndex) continue;
      const productURLList = await getProductListData(`${maxPage.list_url}?p=${page}`);

      const text = `next page !, start_at: ${new Date().toISOString()}, page-url: ${maxPage.list_url}?p=${page}`;
      l(`[${page}/${maxPage.maxPage}]`, "green", text);

      /*END******************************************************************************* */
      // # (4) 각 제품별로 제품 상세에 들어가 상세 정보 페이지 크롤링 //default: i = 0
      for (let i = 0; i < productURLList.length; i++) {
        /*START***************************************************************************** */
        // # skip option
        if (brandIndex == skipProdjct.brandIndex && page == skipProdjct.pageIndex && i < skipProdjct.productIndex)
          continue;
        const product = productURLList[i];
        await getProductDescData(product);

        const start_at = new Date();
        const text = `iherb_product_id: ${product.product_url
          .slice(product.product_url.lastIndexOf("/") + 1, product.product_url.length)
          .padStart(6, " ")}, start_at: ${start_at.toISOString()}`;
        l(`[${i + 1}/${productURLList.length}]`, "cyan", text);

        const end_at = new Date();
        const wait_time = start_at.getTime() + 1200 - end_at.getTime();
        if (wait_time > 0) await wrapSlept(wait_time);
        /*END******************************************************************************* */
      }
    }
  }
  l("[DONE]", "green", "complete - iherb all product price update");
};

// # (1) 브랜드 리스트 가져오기
// Query `select JSON_OBJECT("product_url",product_url,"brand",iherb_product_brand ,"list_url",list_url)  from product_iherb pi2 where yagi_product_id is null`
brandAddIherb(getBrandURLList["active"]);
