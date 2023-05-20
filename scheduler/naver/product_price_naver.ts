import axios from "axios";
import { AuthorizationKey } from "../.././function/auth";
import { updateByProductIdNaver } from "../../naver_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductIdNaver({});
