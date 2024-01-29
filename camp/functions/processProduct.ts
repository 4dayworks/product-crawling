import { l } from "../../function/console";
import { wrapSlept } from "../../function/wrapSlept";
import { writeLog } from "../writeLog";
import { UpdateByProductIdType } from "./UpdateByProductIdType";
import { ProductType } from "./getProductIdList";
import { getStoreList, setStoreList } from "./product";

export const processProduct = async (
  product: ProductType,
  i: number,
  max: number,
  type: UpdateByProductIdType["type"],
  processName: string,
  bot_id: number,
  proxyIP: string
): Promise<boolean> => {
  const {
    product_id,
    itemscout_keyword,
    itemscout_keyword_require,
    itemscout_keyword_exception,
    coupang_keyword_require,
    coupang_keyword_exception,
    coupang_keyword,
    // product_name,
    // product_brand,
    // product_color,
  } = product;

  const message = `product_id: ${product_id}`;

  //   const message = `product_id: ${product_id}
  // min_score: ${min_score}
  // iherb_product_id: ${iherb_product_id}
  // itemscout_keyword: ${itemscout_keyword}
  // itemscout_require_keyword_list: ${itemscout_require_keyword_list}
  // itemscout_exception_keyword_list: ${itemscout_exception_keyword_list}
  // coupang_keyword: ${coupang_keyword}
  // coupang_keyword_before: ${before_coupang_keyword}
  // coupang_require_keyword_list: ${coupang_require_keyword_list}
  // coupang_exception_keyword_list: ${coupang_exception_keyword_list}
  // naver_catalog_url: ${naver_catalog_url}`;
  writeLog(processName, `[${i + 1}/${max}] ${message} ${new Date().toISOString()}`);
  if (!coupang_keyword && !itemscout_keyword) {
    l(`[${i + 1}/${max}]`, "red", message + ", no any keyword");
    return false;
  }
  // itemscount-naver 데이터 체크
  l(`[${i + 1}/${max}]`, "blue", type);
  l(
    `itemscout`,
    itemscout_keyword ? "green" : "yellow",
    `키워드: ${itemscout_keyword}, 필수: ${itemscout_keyword_require}, 제외: ${itemscout_keyword_exception}`,
    false
  );
  // coupang 데이터 체크
  // 0. 쿠팡 키워드 없으면 아이템스카우트로 들어감
  if (!coupang_keyword) {
    l("[INFO]", "blue", "coupang_keyword to itemscout_keyword", false);
    product.coupang_keyword = itemscout_keyword;
  }
  l(
    `coupang`,
    coupang_keyword ? "green" : "yellow",
    `키워드: ${coupang_keyword}, 필수: ${coupang_keyword_require}, 제외: ${coupang_keyword_exception}`,
    false
  );

  const storeList = await getStoreList(product, processName, bot_id, proxyIP, type);
  if (!storeList) return false;
  writeLog(processName, `[${i + 1}/${max}] ${message} ${new Date().toISOString()} store_length: ${storeList.length}`);

  const result = await setStoreList(product, storeList, type);
  if (!result) {
    writeLog(
      processName,
      `[ERROR] No Store List  setStoreList result: null for product_id:${product_id} ${new Date().toISOString()}`
    );
    l("Err", "red", `No Store List setStoreList result: null for product_id:${product_id}`);
    return false;
  }

  const randomTime = Math.floor(Math.random() * 500 + 2000);
  await wrapSlept(randomTime);

  return true;
};
