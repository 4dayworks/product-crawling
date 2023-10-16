import axios from "axios";
import { updateByProductId } from "./all_update";
import { AuthorizationKey } from "./function/auth";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const execute = async () => {
  while (true) {
    await updateByProductId({ type: "coupang" });
  }
};
execute();
