import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  // page: 0,
  // size: 6000,
  // product_id_list: [6124],
  // product_id_list: [
  //   1, 25, 29, 35, 42, 48, 55, 56, 57, 63, 66, 78, 79, 88, 89, 90, 91, 107, 123, 132, 133, 151, 153, 159, 175, 182, 202,
  //   204, 206, 225, 243, 252, 271, 273, 280, 289, 356, 371, 408, 415, 429, 463, 506, 516, 639, 736, 738, 790, 859, 878,
  //   881, 973, 1019, 1022, 1031, 1057, 1178, 1201, 1240, 1637, 1687, 2056, 2304, 2543, 2601, 2604, 2876, 3265, 3315,
  //   3491, 3494, 3518, 3601, 3980, 4003, 4023, 4173, 4190, 4232, 4431, 4458, 4488, 4589, 4701, 4823, 4848, 4986, 5006,
  //   5144, 5235, 5237, 5334, 5404, 5479, 5484, 5515, 5716, 5731, 5771, 5806, 5923, 5951, 6299, 6306, 6403, 6432, 6575,
  //   6614, 6665, 6717, 6733, 6815, 6859, 6869, 6908, 6923, 7029, 7065, 7103, 7187, 7203, 7314, 7332, 7349, 7602, 7776,
  //   7801, 7889, 7993, 8090, 8309, 8319, 8412, 8413, 8460, 8486, 8490, 8495, 8598, 8654, 8662, 8678, 8692, 8699, 8821,
  //   8864, 8974, 8994, 9045, 9110, 9120, 9128, 9198, 9298, 9309, 9374, 9379, 9441, 9459, 9482, 9486, 9503, 9587, 9631,
  //   9649, 9706, 9788, 9855, 10016, 10090, 10185, 10234, 10372, 10429, 10522, 10557, 10564, 10572, 10714, 10722, 10723,
  //   10725, 10917, 10921, 10988, 11122, 11210, 11212, 11231, 11314, 11400, 11436, 11454, 11844, 11847, 11985, 12096,
  //   12241, 12247, 12357, 12450, 12470, 12479, 12500, 12551, 12585, 12601, 12617, 12638, 12705, 12707, 12724, 12758,
  //   12856, 12923, 13047, 13118, 13458, 13504, 13658, 13718, 13770, 14076, 14146, 14223, 14322, 14454, 14590, 14627,
  //   14673, 14757, 14946, 15080, 15309, 15449, 15540, 15833, 15841, 15895, 15910, 15940, 15975, 15997, 16011, 16036,
  //   16061, 16129, 16261, 16407, 16515, 16580, 16717, 17099, 17113, 17216, 17417, 19049, 19060, 19568, 19782, 21408,
  //   21807, 22080, 24839, 24862, 25182, 25954, 26055, 27046, 27735, 28206, 28330, 28560, 29308, 29565, 34953, 36634,
  //   38318, 39182, 39775, 43246, 50002, 54608, 57779, 57806, 57814, 57815, 57816, 57817, 57842, 60668, 60811, 60822,
  //   60830, 60934, 61284, 61381, 61392, 67087, 75055, 78465, 78617, 78736, 81255, 82500, 82701, 86120, 87712, 88206,
  //   89411, 91027,
  // ],
  // 7/3할꺼
  // product_id_list: [
  //   370, 371, 374, 382, 387, 405, 408, 413, 415, 416, 420, 425, 429, 433, 436, 440, 452, 461, 463, 476, 497, 498, 501,
  //   506, 516, 526, 527, 531, 533, 535, 545, 546, 547, 550, 561, 584, 594, 624, 636, 639, 641, 662, 663, 676, 677, 680,
  //   683, 694, 696, 699, 706, 712, 718, 721, 722, 723, 730, 736, 738, 739, 745, 756, 790, 796, 799, 801, 804, 808, 809,
  //   822, 842, 859, 870, 874, 877, 878, 880, 881, 885, 890, 900, 904, 906, 914, 924, 946, 947, 968, 970, 973, 978, 988,
  //   993, 999, 1001, 1007, 1014, 1019, 1022, 1027, 1031, 1034, 1041, 1046, 1048, 1057, 1058, 1069, 1076, 1086, 1097,
  //   1103, 1123, 1138, 1150, 1178, 1187, 1201, 1209, 1234, 1240, 1250, 1261, 1274, 1312, 1571, 1584, 1620, 1633, 1637,
  //   1687, 1743, 1748, 1756, 1778, 1789, 1790, 1796, 1800, 1820, 1835, 1928, 1975, 1991, 2027, 2041, 2044, 2056, 2125,
  //   2161,
  // ],
});
