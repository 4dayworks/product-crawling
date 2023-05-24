import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // product_id_list: [5752, 8481, 23327, 31097],
  // page: 0,
  // size: 6000,
  // product_id_list: Array.from({ length: 5000 }).map((_, i) => i + 1),
});
