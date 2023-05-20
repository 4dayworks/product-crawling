import axios from "axios";
import { updateByProductIdItemscout } from "../../itemscout_update";
import { AuthorizationKey } from "../.././function/auth";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductIdItemscout({ page: 0, size: 3500 });
