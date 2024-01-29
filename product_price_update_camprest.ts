import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByCampProduct } from "./camp/functions/all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByCampProduct({
  // page: 0,
  // size: 6000,
  productSelectedList: [114],
  type: "all",
});

// 캠퍼레스트 제품 (판매처) 업데이트
// yarn update:camperest
