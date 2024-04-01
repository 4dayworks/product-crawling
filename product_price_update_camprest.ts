import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByCampProduct } from "./camp/functions/all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByCampProduct({
  // page: 0,
  // size: 6000,
  productSelectedList: [
    176, 180, 162, 189, 169, 191, 200, 202, 204, 235, 255, 271, 321, 324, 326, 333, 334, 338, 343, 364, 366, 380, 381,
    383, 387, 389, 390, 391, 398, 399, 407, 413, 415, 428, 438, 441, 444, 447, 456, 463, 469, 470, 483, 494, 336, 367,
    455,
  ],
  type: "all",
});

// 캠퍼레스트 제품 (판매처) 업데이트
// yarn update:camperest
