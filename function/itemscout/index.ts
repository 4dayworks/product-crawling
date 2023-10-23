import { uniqBy } from "lodash";
import { ItemscoutType } from ".././updateByItemscout";

/** 아이템스카우트 제외 키워드 판별해주는 함수  */
export function isExceptionKeyword(title: string, exception_keyword: string | null) {
  if (!exception_keyword) return false;
  if (title) return title.includes(exception_keyword);
  return false;
}

/** 아이템스카우트 요구 키워드 판별해주는 함수 */
export const isRequireKeyword = (title: string, require_keyword: string | null) => {
  if (!require_keyword) return true;
  if (title) return title.includes(require_keyword);
  return true;
};

/** 건강식품 중에서 받으면 안되는 것 */
const exceptCategoryObj: {
  [key: string]: boolean;
} = {
  "식품>건강식품>환자식/영양보충식": true,
  "식품>건강식품>건강즙/과일즙": true,
  "식품>건강식품>한방재료": true,
};

/** 건강식품 카테고리는 아니지만, 효과는 건강식품인 카테고리 */
const acceptCategoryObj: {
  [key: string]: boolean;
} = {
  // "식품>다이어트식품>가르시니아": true,
  // "식품>다이어트식품>CLA": true,
  // "식품>다이어트식품>기타다이어트식품": true,
  // "식품>다이어트식품>단백질보충제": true,
  // "식품>다이어트식품>단백질보충제>단백질파우더": true,
  // "식품>다이어트식품>단백질보충제>단백질음료": true,
  // "식품>다이어트식품>식이섬유": true,
  // "식품>다이어트식품>다이어트바": true,
  // "식품>다이어트식품>콜라겐": true,
  // "식품>다이어트식품>히알루론산": true,
  // "식품>다이어트식품": true,
  "생활/건강>반려동물>강아지 건강/관리용품>영양제": true,
  "화장품/미용>스킨케어>크림": true,
  "식품>건강식품>홍삼>홍삼액": true,
  "식품>건강식품>비타민제>비타민C": true,
  "식품>음료>우유/요구르트>우유": true,
  "식품>건강식품>건강분말": true,
};

/** 제외해야할 category를 필터링 해주는 함수입니다.
 * 순서는 무조건 아래의 if문으로 사용해야합니다.
 * 건강식품 카테고리가 아닌 상품에 대해서 먼저 처리해야하기 때문에 순서가 중요합니다.
 */
export const exceptCategory = (category: string) => {
  const categoryData = String(category).split(">");
  if (category.includes("식품>다이어트식품")) return true;
  if (category.includes("")) return true;
  if (acceptCategoryObj[category]) return true;
  if (categoryData[0] !== "식품") return false;
  if (exceptCategoryObj[category]) return false;
  if (categoryData[1] !== "건강식품") return false;
  return true;
};

export const filterArray = (
  array: any[]
  // is_drugstore: number,
  // originData: getAllProductIdType,
  // iherbPriceData?: IherbPriceType | null
) => {
  return uniqBy(array as any[], (item) => `${item.mall}-${item.title}-${item.price}-${item.delivery}`).filter(
    (p: ItemscoutType) =>
      p.isAd === false &&
      // (p.isOversea === false || is_drugstore === 4) && // is_drugstore 4는 해외제품이므로 해외여부 무시.
      // !isExceptionKeyword(p.title, originData.exception_keyword) &&
      // isRequireKeyword(p.title, originData.require_keyword) &&
      exceptCategory(p.category) &&
      p.mall !== "쿠팡" //쿠팡 제외
  );
};
