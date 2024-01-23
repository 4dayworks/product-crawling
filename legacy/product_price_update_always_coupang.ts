import axios from "axios";
import { updateByYagiProduct } from "./all_update";
import { AuthorizationKey } from "../function/auth";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const execute = async () => {
  while (true) {
    await updateByYagiProduct({ type: "coupang" });
  }
};
execute();
