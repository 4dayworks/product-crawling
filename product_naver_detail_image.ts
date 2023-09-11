import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL } from "./function/common";
import {
  getNaverCatalogStoreImageListV5,
  setProductImage,
} from "./function/naverCatalogImage/getNaverCatalogStoreImageListV5";
import { wrapSlept } from "./function/wrapSlept";
import { naverCatalogCompletedList } from "./function/naverCatalogImage/completeList";

//실행방법: yarn update:product-image
// naver_url_list=아래 쿼리,
// select pg.product_id, ppck.naver_catalog_url
//  from product_good pg
//  left join product p on p.product_id = pg.product_id
//  left join (select * from product_price_crawling_keyword ppck where naver_catalog_url like "%msearch%") ppck on ppck.yagi_product_id = pg.product_id
//  where user_id = 498 and length(p.detail_image_list) = 2 and ppck.naver_catalog_url is not null
//  order by pg.product_id

// https://m.smartstore.naver.com/dailyhealthlab/products/5504588619 이런거 불가능
// https://msearch.shopping.naver.com/catalog/6743170459 이런거 잘됨
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;
async function getProductImage() {
  axios.get(`${NODE_API_URL}/slack/crawling?message=product_naver_image_get_START!`);
  const naver_url_list: { product_id: number; naver_catalog_url: string }[] = await axios
    .get(`${NODE_API_URL}/crawling/naver/image/list`)
    .then((d) => d.data.data);

  for (let i = 0; i < naver_url_list.length; i++) {
    const { product_id: pid, naver_catalog_url } = naver_url_list[i];
    //이미 처리된 제품들 제거
    if (naverCatalogCompletedList.includes(pid)) continue;
    wrapSlept(100);
    const imageList = await getNaverCatalogStoreImageListV5(pid, naver_catalog_url);

    if (imageList?.length === undefined) {
      wrapSlept(30000);
      i--;
      continue;
    }
    console.log(`[${i + 1}/${naver_url_list.length}]`, pid, imageList?.length);
    if (!imageList || imageList.length === 0) continue;
    await setProductImage(pid, imageList);
  }
  axios.get(`${NODE_API_URL}/slack/crawling?message=product_naver_image_get_END!`);
}

getProductImage();
