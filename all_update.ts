import axios, { AxiosError } from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import { getStoreListV5, setGraphV5, setLastMonthLowPriceV5, setStoreListV6 } from "./function/product";
import { wrapSlept } from "./function/wrapSlept";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;
export type updateByProductIdType = {
  page?: number;
  size?: number;
  product_id_list?: number[];
  startIndex?: number;
  instanceData?: {
    startIndex: number | undefined;
    instance_name: string | undefined;
  };
  type: "all" | "no-coupang" | "coupang";
  waitTime?: number;
};

export type getProductTypeV6 = {
  product_id: number;
  min_score: string | null;
  itemscout_keyword: string | null;
  itemscout_require_keyword_list: string | null;
  itemscout_exception_keyword_list: string | null;
  coupang_keyword: string | null;
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
  naver_catalog_url: string | null;
  iherb_product_id: number | null;
  before_coupang_keyword: string | null;
};

let isInit = true;
export const updateByProductId = async ({
  page = 0,
  size = 1000000,
  product_id_list: productSelectedList,
  instanceData,
  type,
  waitTime = 1 * 2 * 60 * 1000, //2분, (1시간=>1*60*60*1000)
}: updateByProductIdType) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기

  let productIdListAll: number[] | null = await axios(
    type === "coupang" || type === "no-coupang"
      ? `${NODE_API_URL}/v6/crawling/product/id/list?page=${page}&size=${size}&is_no_coupang=${
          type === "no-coupang" ? true : false
        }`
      : `${NODE_API_URL}/v5/crawling/product/id/list?page=${page}&size=${size}`
  )
    .then((d) => d.data.data)
    .catch((err) => {
      const axiosErr = err as AxiosError;
      if (axiosErr.response?.status === 502) {
        l("502 Error", "red", axiosErr.message);
      } else {
        l("Axios Error", "red", "crawling/product/id/list " + axiosErr.message);
      }
      return null;
    });

  // 제품아이디리스트 null 체크
  if (productIdListAll === null) {
    const message = `instance_name: ${instanceData?.instance_name} / message: Not get productIdListAll`;
    await axios
      .get(`${NODE_API_URL}/slack/crawling?message=${message}`)
      .then((res) => res.data.data)
      .catch((err) => l("Err", "red", "Slack Send Message Error"));
    return;
  }

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (productSelectedList) productIdListAll = productIdListAll.filter((id) => productSelectedList.includes(id));

  // 가져올 제품 갯수 체크
  if (productIdListAll.length === 0)
    return l("STOP", "red", "크롤링할 제품이 없습니다. product_price_crawling_keyword에 데이터를 추가해주세요.");

  // 배열 섞기
  // if (!productSelectedList) productIdListAll = shuffle(productIdListAll);

  let chance = 3; //다시 시도할 기회
  //#region 1/3 쿠팡 MAX check 로직
  // let completeCount = 0; //크롤링 성공한 제품수
  //#endregion
  for (let i = 0; i < productIdListAll.length; i++) {
    //#region 2/3 쿠팡 MAX check 로직
    // if (["coupang", "all"].includes(type || "") && completeCount > 1000) {
    //   const message = `instance_name: ${instanceData?.instance_name}, index: ${
    //     i + 1
    //   } / message: coupang max reached 1000 / remain_change: ${chance} / completeCount: ${completeCount}`;
    //   await axios
    //     .get(`${NODE_API_URL}/slack/crawling?message=${message}`)
    //     .then((res) => res.data.data)
    //     .catch(() => l("Err", "red", "Slack Send Message Error"));
    //   await axios
    //     .get(`http://34.22.78.170:3001/gcp/restart?instance_name=${instanceData?.instance_name}&start_index=${i - 1}`)
    //     .then((res) => res.data.data)
    //     .catch(() => l("Err", "red", "Slack Send Message Error"));
    //   return;
    // }
    //#endregion

    if (isInit && instanceData?.startIndex != undefined && instanceData.startIndex > 0) {
      i = instanceData.startIndex;
      isInit = false;
    }
    if (productIdListAll.length > i) {
      const product: getProductTypeV6 | null = await axios(
        `${NODE_API_URL}/v6/crawling/product?product_id=${productIdListAll[i]}`
      )
        .then((d) => d.data.data)
        .catch((err) => {
          const axiosErr = err as AxiosError;
          if (axiosErr.response?.status === 502) l("502 Error", "red", axiosErr.message);
          return null;
        });
      if (product === null) continue;
      const result = await setData(product, i, productIdListAll.length, type);

      l("[result]", "magenta", String(result));
      if (!result) {
        if (chance > 0) {
          const message = `instance_name: ${instanceData?.instance_name}, index: ${i + 1} / product_id: ${
            product.product_id
          } / message: continuous error 1 / remain_change: ${chance}`;
          if (chance < 2)
            await axios
              .get(`${NODE_API_URL}/slack/crawling?message=${message}`)
              .then((res) => res.data.data)
              .catch((err) => l("Err", "red", "Slack Send Message Error"));

          // 문제 생겼을시 2분 대기 후 다음 재시도
          await wrapSlept(waitTime);
          chance--;
          if (chance === 1) i--;
          continue;
        } else {
          if (i >= 2) {
            const message = `instance_name: ${instanceData?.instance_name}, index: ${i + 1} / product_id: ${
              product.product_id
            } / message: continuous error 2 / remain_change: ${chance} / remain chance out -> Crawling Server Restart !!`;
            if (instanceData?.instance_name != undefined) {
              await axios
                .get(`${NODE_API_URL}/slack/crawling?message=${message}`)
                .then((res) => res.data.data)
                .catch((err) => l("Err", "red", "Slack Send Message Error"));
              await axios
                .get(
                  `http://34.64.51.83:3001/gcp/restart?instance_name=${instanceData.instance_name}&start_index=${i - 1}`
                )
                .then((res) => res.data.data)
                .catch((err) => l("Err", "red", "Slack Send Message Error"));
            }
          }
          break;
        }
      }
      chance = 3;
      //#region 3/3 쿠팡 MAX check 로직
      // completeCount++;
      //#endregion
    }
  }
  l("[DONE]", "blue", "complete - all product price update");
};

const setData = async (product: getProductTypeV6, i: number, max: number, type: updateByProductIdType["type"]) => {
  const color = product.naver_catalog_url !== null ? "green" : "yellow";
  const s = `[${i + 1}/${max}]id:${product.product_id}`;
  const startTime = new Date().getTime();
  l(
    `[${i + 1}/${max}]`,
    color,
    `product_id: ${product.product_id}
  min_score: ${product.min_score}
  itemscout_keyword: ${product.itemscout_keyword}
  itemscout_require_keyword_list: ${product.itemscout_require_keyword_list}
  itemscout_exception_keyword_list: ${product.itemscout_exception_keyword_list}
  coupang_keyword: ${product.coupang_keyword}
  coupang_keyword_before: ${product.before_coupang_keyword}
  coupang_require_keyword_list: ${product.coupang_require_keyword_list}
  coupang_exception_keyword_list: ${product.coupang_exception_keyword_list}
  naver_catalog_url: ${product.naver_catalog_url}
  iherb_product_id: ${product.iherb_product_id}
  `
  );

  // -- main logic --
  const storeList = await getStoreListV5({
    ...product,
    coupang_keyword:
      type === "all" ? product.coupang_keyword || product.before_coupang_keyword : product.coupang_keyword, //전체 돌릴때는 과거 쿠팡 키워드 활용
  });
  if (storeList === null) return false;
  const result = await setStoreListV6(product, storeList, type);

  if (result === null) {
    l("Err", "red", `${s} setStoreList result: null`);
    return false;
  }

  await setGraphV5(product);
  await setLastMonthLowPriceV5(product);

  const executeTime = new Date().getTime() - startTime;
  const randomTime = Math.floor(Math.random() * 4000); //유저라는 걸 인식하기 위해 랜덤 시간
  const waitTime =
    (type === "coupang" ? 10000 : type == "all" || product.naver_catalog_url !== null ? 1000 : 6000) -
    executeTime +
    randomTime;
  await wrapSlept(waitTime < 0 ? 0 : waitTime);

  const endTime = ((new Date().getTime() - startTime) / 1000).toFixed(2);
  l(
    "TIME",
    "blue",
    `id:${product.product_id} 종료 시간: ${endTime}s, end_at: ${new Date().toUTCString()}, 작업 시간:${(
      executeTime / 1000
    ).toFixed(2)}s\n`
  );
  return true;
};

// 92에서 멈춤
