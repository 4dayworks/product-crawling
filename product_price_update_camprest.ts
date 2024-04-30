import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByCampProduct } from "./camp/functions/all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const productSelectedList: number[] = [
  // 7026, 7027, 7028, 7029, 7030, 7032, 7164, 7165, 7166, 7307, 7308, 7309, 7310, 7311,
  7309,
];

const isProcess = 1;
if (isProcess)
  updateByCampProduct({ productSelectedList, type: "all" }).then(() =>
    console.log(productSelectedList.map((i) => "https://mobile.camperest.kr/product/" + i))
  );
else console.log(productSelectedList.map((i) => "https://mobile.camperest.kr/product/" + i));

// 캠퍼레스트 제품 (판매처) 업데이트
// yarn update:camperest
