import axios from "axios";
import { AuthorizationKey } from "../../function/auth";
import { updateByProductIdItemscout } from "../../itemscout_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductIdItemscout({ page: 2, size: 3500 });
