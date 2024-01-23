import { uniqBy } from "lodash";
import { ItemscoutType } from "../types/craw";

/** 절대 허용하지 말아야할 카테고리 - 아이템스카우트 카테고리 기준 */
const exceptCategoryObj: {
  [key: string]: boolean;
} = {
  // "식품>건강식품>환자식/영양보충식": true,
};

/** 강제로 허용할 카테고리 - 아이템스카우트 카테고리 기준 */
const acceptCategoryObj: {
  [key: string]: boolean;
} = {
  // "식품>다이어트식품>가르시니아": true,
};

/** 허용된 카테고리 여부 */
const isAcceptCategory = (category: string) => {
  const categoryData = String(category).split(">");
  // if (category.includes("식품>다이어트식품")) return true;
  // if (category.includes("")) return true;
  // if (categoryData[0] !== "식품") return false;
  // if (categoryData[1] !== "건강식품") return false;

  if (acceptCategoryObj[category]) return true;
  if (exceptCategoryObj[category]) return false;
  return true;
};

export const filterArray = (array: any[]) => {
  return uniqBy(array as any[], (item) => `${item.mall}-${item.title}-${item.price}-${item.delivery}`).filter(
    (p: ItemscoutType) =>
      p.isAd === false &&
      // (p.isOversea === false || is_drugstore === 4) && // is_drugstore 4는 해외제품이므로 해외여부 무시.
      // !isExceptionKeyword(p.title, originData.exception_keyword) &&
      // isRequireKeyword(p.title, originData.require_keyword) &&
      isAcceptCategory(p.category) &&
      p.mall !== "쿠팡" //쿠팡 제외
  );
};
