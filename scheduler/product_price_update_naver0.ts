import axios from "axios";
import { AuthorizationKey } from ".././function/auth";
import { updateByProductIdByNaver } from "./update_naver";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

updateByProductIdByNaver({ page: 0, size: 3000 });
