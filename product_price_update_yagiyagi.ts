import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByYagiProduct } from "./backup/all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByYagiProduct({
  // page: 0,
  // size: 6000,
  product_id_list: [1, 2, 3],
  type: "all",
});

// 야기야기 제품 (판매처) 업데이트
// yarn update:yaigyagi
