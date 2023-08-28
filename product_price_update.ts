import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // page: 0,
  // size: 6000,
<<<<<<< HEAD
  product_id_list: [82829],
=======
  product_id_list: [73],
>>>>>>> 8a1dcf04b64d6824e3f811a32ab4db9c29c2a95a
});
