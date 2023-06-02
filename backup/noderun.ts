import { countBy } from "lodash";
// import { iherb_list_rank_category } from "./backup/아이허브랭킹카테고리";
import { iherb_list_ingredient } from "./아이허브성분";
function start_lodash() {
  const list = iherb_list_ingredient;

  console.info(countBy(list));
  // console.info(uniq(list).join(","));
}

start_lodash();
