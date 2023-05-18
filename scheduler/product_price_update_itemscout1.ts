import axios from "axios";
import { AuthorizationKey } from "../function/auth";
import { updateByProductIdByItemscout } from "./update_itemscout";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

updateByProductIdByItemscout({ page: 0, size: 3000 });
