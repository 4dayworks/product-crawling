import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // page: 0,
  // size: 6000,
  product_id_list: [
    88722, 88723, 88724, 88725, 88727, 88728, 88729, 88730, 88731, 88732, 88736, 88738, 88739, 88747, 88749, 88750,
    88752, 88753, 88755, 88758, 88759, 88760, 88761, 88763, 88764, 88766, 88767, 88768, 88769, 88770, 88771, 88773,
    88775, 88776, 88784, 88786, 88787, 88788, 88789, 88790, 88791, 88794, 88795, 88796, 88798, 88799, 88803, 88804,
    88805, 88807, 88808, 88810, 88811, 88812, 88813, 88814, 88815, 89910, 89919, 89922, 89924, 89928, 89929, 89946,
    89947, 89967, 89969, 89971, 89972, 89976, 89990, 89991, 89993, 89999, 90001, 90007, 90009, 90011, 90012, 90017,
  ],
});
