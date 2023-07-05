import { getNaverCatalogStoreImageListV5 } from "./function/getNaverCatalogStoreImageListV5";

const naver_url = "https://m.smartstore.naver.com/elch/products/6801115638";
// https://m.smartstore.naver.com/dailyhealthlab/products/5504588619 이런거 불가능
// https://msearch.shopping.naver.com/catalog/6743170459 이런거 잘됨

async function getProductImage() {
  const imageList = await getNaverCatalogStoreImageListV5(1, naver_url);
  console.log(imageList);
  // await setProductImage(imageList);
}

getProductImage();
