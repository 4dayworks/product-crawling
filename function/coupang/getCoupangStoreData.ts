import axios, { AxiosError } from "axios";
import { getAllProductIdType } from "../../product_price_update";
import { l } from "../console";
import { NODE_API_URL } from "../common";
import { AuthorizationKey } from "../auth";
import { wrapSlept } from "../wrapSlept";
import { ItemscoutType } from "../updateByItemscout";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;
export const getCoupangStoreData = async ({
  product_id,
  product_name,
}: // coupang_itemscout_keyword,
// coupang_itemscout_keyword_id,

// coupang_exception_keyword_list,
// coupang_allow_tag,
// coupang_require_keyword_list,
getAllProductIdType) => {
  // 개요
  // 1. 키워드/키워드id DB에서 가져오기
  // 2. 키워드id 없을경우 itemscout 에서 keyword_id 가져오기
  //  2-1. 야기야기 DB에 키워드 저장
  // 3. 아이템스카우트에서 판매처가져와서 필터링하기, tag, exception_list, require_list 활용
  //  3-1. exception_list, require_list, rocketType(coupang_allow_tag) 로 필터링하기
  // 4. 필터링된 판매처 함수에서 반환하기

  // 1. 키워드/키워드id DB에서 가져오기
  const {
    coupang_itemscout_keyword_id,
    coupang_itemscout_keyword,
    coupang_require_keyword_list,
    coupang_exception_keyword_list,
    coupang_allow_tag,
  }: CoupangDataType = await axios
    .get(
      `${NODE_API_URL}/crawling/product/coupang/keyword?product_id=${product_id}`
    )
    .then((d) => d.data.data);

  // 2. 키워드id 없을경우 itemscout 에서 keyword_id 가져오기
  let keyword_id = coupang_itemscout_keyword_id;
  const keyword = coupang_itemscout_keyword
    ? coupang_itemscout_keyword
    : product_name;
  if (!coupang_itemscout_keyword_id) {
    const url = `https://api.itemscout.io/api/keyword`;
    const itemscout_keyword_id = await axios
      .post(url, { keyword }, { headers })
      .then((d) => d.data.data)
      .catch(async (error: AxiosError) => {
        if (error.response?.status === 429) {
          l(
            "현재 요청을 많이 하여 5분간 기다리겠습니다.",
            "yellow",
            new Date().toISOString()
          );
          await wrapSlept(1000 * 60 * 5);
          const itemscout_keyword_id = await axios
            .post(url, { keyword }, { headers })
            .then((d) => d.data.data)
            .catch((error) => null);
          return itemscout_keyword_id;
        }
        return null;
      });
    keyword_id = itemscout_keyword_id;

    // 2-1. 야기야기 DB에 키워드 저장
    await axios.post(`${NODE_API_URL}/crawling/product/coupang/keyword`, {
      product_id,
      keyword_id: itemscout_keyword_id,
      keyword,
    });
  }

  // 에러처리
  if (!keyword_id) {
    l("Err", "red", `[coupang] No keyword_id product_id:${product_id}`);
    return [];
  }

  // 3. 아이템스카우트에서 판매처가져와서 필터링하기, tag, exception_list, require_list 활용
  let storeList: ItemscoutType[] = [];
  await axios
    .get(
      `https://api.itemscout.io/api/v2/keyword/products?kid=${keyword_id}&type=coupang`,
      { headers }
    )
    .then((d) => {
      const coupangList = d.data.data
        .productListResult as ItemscoutCoupangStoreType[];
      coupangList.forEach((c, i) => {
        if (!c.rocketType) return;
        const data: ItemscoutType = {
          title: keyword, // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름",
          image: c?.image ?? "", // "https://shopping-phinf.pstatic.net/main_8545538/85455382789.1.jpg",
          productId: Number(c.productId) + i, // 85455382789,
          price: c?.price ?? 0, // 25900,
          category: "", // "식품>건강식품>영양제>기타건강보조식품",
          reviewCount: c?.reviewCount ?? 0, // 19,
          reviewScore: c?.reviewScore ?? 0, //5,
          chnlSeq: undefined,
          mallPids: [],
          isException: false,
          categoryStack: [],
          shop: c.rocketType,
          isList: false,
          link: c?.link ?? "",
          mallPid: "",
          multiShops: 0,
          volume: 0,
          openDate: "",
          purchaseCnt: 0,
          keepCnt: 0,
          mallGrade: c.rocketType,
          deliveryFee: "",
          chnlSeqs: [],
          mall: c.rocketType,
          mallImg: null,
          isOversea: c.rocketType === "로켓직구" ? true : false,
          isNaverShop: false,
          isAd: false,
          pcProductUrl: c?.link ?? "",
          mobileProductUrl: c?.link ?? "",
        };
        storeList.push(data);
      });
    })
    .catch(() => []);

  // 3-1. exception_list, require_list, rocketType(coupang_allow_tag) 로 필터링하기

  const exception_list = coupang_exception_keyword_list
    ? coupang_exception_keyword_list.split(",").map((k) => k.trim())
    : [];
  const require_list = coupang_require_keyword_list
    ? coupang_require_keyword_list.split(",").map((k) => k.trim())
    : [];
  const allow_tag = coupang_allow_tag
    ? coupang_allow_tag.split(",").map((k) => k.trim())
    : [];

  storeList = storeList
    .filter(
      (s) =>
        require_list.map((r) => s.title.includes(r)).filter((b) => b === false)
          .length === 0 &&
        exception_list.map((r) => s.title.includes(r)).filter((b) => b === true)
          .length === 0 &&
        s.mallGrade && // rocketType
        allow_tag.includes(s.mallGrade) && //rocketType
        !s.isAd
    )
    .slice(0, 2);

  // 4. 필터링된 판매처 함수에서 반환하기
  return storeList;
};

const headers = { "Accept-Encoding": "deflate, br" };

type CoupangDataType = {
  coupang_itemscout_keyword_id: string | null;
  coupang_itemscout_keyword: string | null;
  coupang_require_keyword_list: string | null;
  coupang_exception_keyword_list: string | null;
  coupang_allow_tag: string | null;
};
export type ItemscoutCoupangStoreType = {
  seq: number; //1,
  productId: string; //"205187263";
  title: string; //"Evlution Nutrition L-카르니틴 500mg 캡슐, 120개입, 1개";
  price: number; //17200,
  image: string; //"https://thumbnail10.coupangcdn.com/thumbnails/remote/230x230ex/image/vendor_inventory/images/2019/04/03/17/6/5958c12d-e34f-4393-83a4-29f49f67ae62.jpg";
  link: string; //"https://www.coupang.com/vp/products/205187263?itemId=604043537&vendorItemId=4583175650";
  isAd: boolean;
  isRocket: boolean;
  rocketType: "로켓직구" | "로켓배송" | "제트배송" | "로켓프레시" | null; //"로켓직구";
  reviewScore: number; //4.5;
  reviewCount: number; //24;
};
