import { ThirthMallProductType, getStoreData, saveProductList } from "./function/product_thirthmall.module";

async function fetchPageData(urlList: string[]) {
  const productList: ThirthMallProductType[] = [];
  console.info(`Start fetching product list`, new Date().toISOString());
  for (let i = 0; i < urlList.length; i++) {
    const list = await getStoreData(urlList[i]);
    if (list) productList.push(...list);
    console.info(
      `[${i + 1}/${urlList.length}] Complete fetching product list - product length ${productList.length}`,
      new Date().toISOString()
    );
  }
  console.info(`End fetching product list`, new Date().toISOString());
  console.info("총 떠리몰 제품수:", productList.length);

  saveProductList(productList);
}

const urlList = [
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=1",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=2",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=3",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=4",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=5",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=6",
];
fetchPageData(urlList);
