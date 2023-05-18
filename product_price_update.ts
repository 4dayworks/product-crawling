import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { getAllProductIdType } from "./function/product_price_update";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({});

export { getAllProductIdType };
// product_id = 67081
// keyword_id = 365228494
