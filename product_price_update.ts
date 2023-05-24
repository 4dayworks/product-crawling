import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// updateByProductId({page: 0, size: 3000, product_id_list: [12414,121213]});
updateByProductId({
  product_id_list: [
    25343, 25393, 25395, 25398, 25428, 25499, 25564, 25596, 25621, 25622, 25624,
    25631, 25643, 25662, 25719, 25728, 25742, 25782, 25836, 25913, 25989, 26149,
    26220, 26230, 26231, 26251, 26274, 26283, 26314, 26315, 26317, 26321, 26350,
    26383, 26384, 26477, 26483, 26516, 26529, 26581, 26582, 26655, 26761, 26785,
    26813, 26841, 26865, 26897, 26981, 27010, 27053, 27106, 27112, 27132, 27156,
    27175, 27237, 27308, 27345, 27369, 27402, 27444, 27495, 27496, 27575, 27595,
    27656, 27683, 27685, 27702, 27714, 27757, 27765, 27800, 27918, 27923, 27942,
    28020, 28076, 28093, 28094, 28174, 28230, 28234, 28275, 28277, 28291, 28434,
    28465, 28492, 28647, 28648, 28649, 28739, 28839, 28846, 28865, 28878, 28927,
    28981, 29133, 29267, 29397, 29419, 29468, 29469, 29493, 29657, 29686, 29820,
    29855, 29863, 29979, 30064, 30220, 30222, 30245, 30257, 30280, 30300, 30356,
    30362, 30368, 30412, 30432, 30441, 30442, 30492, 30521, 30567, 30608, 30739,
    30741, 30804, 30810, 30846, 31049, 31097, 31137, 31155, 31218, 31222, 31244,
    31324, 31393, 31458, 31662, 31663, 31711, 31762, 31811, 31820, 31836, 31856,
    31909, 31993, 32096, 32128, 32182, 32280, 32281, 32400, 32491, 32495, 32530,
    32585, 32592, 32600, 32625, 32629, 32641, 32643, 32647, 32667, 32687, 32693,
    32699, 32755, 32757, 32767, 32787, 32812, 32848, 32849, 32926, 32971, 33029,
    33092, 33291, 33670, 33723, 33876, 33892, 34030, 34033, 34056, 34064, 34087,
    34093, 34099, 34102, 34128, 34155, 34163, 34243, 34258, 34263, 34270, 34286,
    34303, 34319, 34325, 34329, 34358, 34362, 34368, 34372, 34433, 34449, 34491,
    34495, 34516, 34524, 34532, 34544, 34550, 34554, 34560, 34613, 34642, 34717,
    34742, 34756, 34760, 34778, 34838, 34875, 34936, 34947, 34964, 34969, 35028,
    35044, 35093, 35100, 35134, 35160, 35178, 35202, 35329, 35355, 35378, 35454,
    35455, 35463, 35464, 35485, 35508, 35619, 35622, 35626, 35643, 35669, 35685,
    35698, 35713, 35721, 35754, 35767, 35775, 35781, 35807, 35822, 35840, 35967,
    35980, 36015, 36021, 36052, 36089, 36102, 36115, 36121, 36155, 36187, 36191,
    36220, 36300, 36359, 36362, 36397, 36426, 36431, 36448, 36461, 36495, 36526,
    36528, 36538, 36541, 36589, 36597, 36617, 36662, 36710, 36730, 36743, 36778,
    36812, 36870, 36876, 36886, 36946, 36971, 36978, 37016, 37021, 37023, 37046,
    37082, 37143, 37151, 37217, 37234, 37290, 37351, 37356, 37374, 37412, 37421,
    37436, 37444, 37478, 37507, 37534, 37541, 37554, 37566, 37604, 37620, 37654,
    37704, 37711, 37744, 37789, 37793, 37851, 37859, 37929, 37954, 37979, 38015,
    38027, 38140, 38178, 38235, 38237, 38243, 38261, 38284, 38297, 38326, 38331,
    38339, 38387, 38427, 38447, 38464, 38471, 38490, 38493, 38548, 38551, 38556,
    38558, 38565, 38631, 38637, 38648, 38670, 38688, 38746, 38763, 38768, 38796,
    38801, 38809, 38812, 38829, 38865, 38889, 38898, 38925, 39076, 39098, 39157,
    39169, 39184, 39197, 39348, 39407, 39510, 39519, 39568, 39620, 39621, 39646,
    39656, 39672, 39682, 39696, 39723, 39792, 39801, 39899, 39987, 39991, 40046,
    40112, 40146, 40167, 40193, 40234, 40237, 40262, 40276, 40288, 40298, 40303,
    40480, 40510, 40553, 40564, 40636, 40738, 40745, 40858, 40920, 40923, 41177,
    41216, 41218, 41291, 41429, 41453, 41468, 41531, 41603, 42015, 42104, 42161,
    42176, 42195, 42937, 43317, 43369, 43392, 57781, 57782, 57789, 57794, 57796,
    57805, 57822, 57824, 57829, 57832, 57833, 57839, 57840, 57841, 57856, 57861,
    57863, 57864, 57873, 57907,
  ],
  // page: 0,
  // size: 6000,
  // product_id_list: Array.from({ length: 5000 }).map((_, i) => i + 1),
});
