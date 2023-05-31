import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // product_id_list: [
  //   22652, 34443, 66672, 22824, 24723, 38816, 24936, 29123, 23519, 23519, 66696, 66696, 31903, 29526, 24957, 24957,
  //   36461, 36461, 36461, 35702, 35702, 35485, 35485, 32757, 32757, 22664, 29427, 29427, 25596, 42782, 27800, 34008,
  //   39155, 39155, 37408, 37408, 36584, 36584, 36584, 36584, 25719, 25719, 34723, 57781, 24435, 24435, 42164, 42164,
  //   32075, 32075, 23401, 23401, 36201, 36201, 27135, 27135, 35429, 35429, 23977, 23977, 23977, 23977, 26600, 26600,
  //   26600, 26600, 30748, 30748, 26382, 26810, 26810, 35058, 35058,
  // ],
  // page: 0,
  // size: 6000,
  // product_id_list: Array.from({ length: 100 }).map((_, i) => i + 1),
});
