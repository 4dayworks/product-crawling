import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // page: 0,
  // size: 6000,
  // product_id_list: [
  //   82027, 91368, 70002, 70003, 70004, 70012, 70013, 70015, 70017, 70019, 70025, 70026, 70027, 70029, 70034, 70035,
  //   70038, 70042, 70047, 70051, 70055, 70057, 70058, 70060, 70063, 70064, 70068, 70072, 70077, 70078, 70079, 70087,
  //   70088, 70089, 70091, 74148, 70097, 74150, 70098, 74151, 74152, 74153, 74154, 70102, 74156, 74158, 74159, 70107,
  //   74162, 70108, 74164, 74165, 74166, 78297, 74167, 78298, 70112, 78299, 70113, 74169, 74170, 78301, 78302, 74172,
  //   78303, 74173, 78304, 74174, 74175, 70120, 78307, 70122, 78309, 74180, 78312, 70126, 70127, 74182, 78314, 74183,
  //   78315, 74184, 78316, 78317, 70131, 78318, 78320, 70134, 78321, 78323, 74189, 74191, 78325, 70137, 74193, 78328,
  //   74194, 74195, 78329, 74196,
  // ],
});
