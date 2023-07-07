import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // page: 0,
  // size: 6000,
  product_id_list: [
    88663, 88662, 88660, 88622, 88620, 88619, 88618, 88617, 88611, 88610, 88607, 88606, 88604, 88603, 88600, 88599,
    88598, 88342, 86898,
  ],
});
