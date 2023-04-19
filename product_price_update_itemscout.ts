import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL } from "./function/common";
import { l } from "./function/console";
import { wrapSlept } from "./function/wrapSlept";
import { getAllProductIdType } from "./product_price_update.d";
import { setGraph, setLastMonthLowPrice, shuffle } from "./function/product";
import { getProductByItemscoutV2 } from "./function/updateByItemscoutV2";
import { getProductPriceData } from "./function/updateByIherb";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateByProductId = async (product_id_list?: number[]) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let data: getAllProductIdType[] = await axios(`${NODE_API_URL}/v2/crawling/product/all`).then((d) => d.data.data);
  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) data = data.filter((p) => product_id_list.includes(p.product_id));

  //#region (2) 성지가격있는 제품아이디 모두 제외시키기
  const exceptionList: number[] = await axios(`${NODE_API_URL}/crawling/product/holyzone/all`)
    .then((d) => {
      const data: { product_id: number; product_name: string }[] = d.data.data;
      return data.map((p) => p.product_id);
    })
    .catch((e) => {
      l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/all" + e.code);
      return [];
    });
  data = data.filter((p) => !exceptionList.includes(p.product_id));
  shuffle(data);

  for (let i = 0; i < data.length; i++) {
    const product = data[i];

    if (product.type === "itemscout") {
      const res =
        product.iherb_list_url && product.iherb_product_url && product.iherb_brand
          ? await getProductPriceData({
              list_url: product.iherb_list_url,
              product_url: product.iherb_product_url,
              brand: product.iherb_brand,
            })
          : null;
      const iherbPriceData: IherbPriceType | null = res
        ? {
            ...res,
            list_url: product.iherb_list_url,
            product_url: product.iherb_product_url,
            brand: product.iherb_brand,
            iherb_product_image: product.iherb_product_image,
          }
        : null;

      await getProductByItemscoutV2(product, i + 1, data.length, iherbPriceData);
      await setGraph(product);
      await setLastMonthLowPrice(product);
      await wrapSlept(500);
      l("timestamp", "cyan", new Date().toISOString());
    }
  }
  l("[DONE]", "blue", "complete - all product price update");
};

export type IherbPriceType = {
  iherb_product_id: string;
  is_stock: string;
  origin_price: string | number | undefined;
  discount_percent: number;
  discount_type: number | null;
  discount_price: number | null;
  delivery_price: number;
  rating: number | undefined;
  review_count: number | undefined;
  list_url: string | null;
  product_url: string | null;
  brand: string | null;
  iherb_product_image: string | null;
};
// updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateByProductId(Array.from({ length: 100 }).map((a, i) => i + 1));
// select product_id  from product p where is_drugstore  = 4;
updateByProductId([
  60015,
  // 60015, 60035, 60233, 60234, 60250, 60258, 60302, 60316, 60369, 60383, 60394, 60398, 60419, 60515, 60582, 60593, 60608,
  // 60615, 60628, 60630, 60636, 60637, 60639, 60649, 60659, 60660, 60661, 60663, 60700, 60707, 60748, 60759, 60762, 60765,
  // 60767, 60768, 60781, 60782, 60783, 60784, 60785, 60786, 60794, 60797, 60799, 60801, 60805, 60821, 60823, 60825, 60830,
  // 60831, 60832, 60833, 60834, 60836, 60837, 60841, 60843, 60847, 60848, 60849, 60850, 60855, 60858, 60859, 60862, 60864,
  // 60865, 60866, 60867, 60868, 60869, 60870, 60871, 60872, 60873, 60874, 60875, 60876, 60878, 60881, 60884, 60885, 60886,
  // 60888, 60889, 60891, 60892, 60893, 60895, 60896, 60899, 60900, 60901, 60902, 60904, 60921, 60922, 60924, 60925, 60935,
  // 60941, 60958, 60959, 60961, 60965, 60966, 60975, 60976, 60977, 60984, 60989, 61001, 61003, 61040, 61054, 61055, 61056,
  // 61060, 61063, 61064, 61065, 61066, 61067, 61073, 61077, 61080, 61082, 61084, 61085, 61088, 61090, 61091, 61092, 61095,
  // 61099, 61103, 61105, 61106, 61108, 61112, 61121, 61122, 61123, 61125, 61130, 61131, 61132, 61134, 61139, 61142, 61144,
  // 61148, 61150, 61159, 61161, 61162, 61163, 61168, 61169, 61177, 61181, 61184, 61185, 61187, 61189, 61192, 61193, 61196,
  // 61197, 61201, 61202, 61210, 61211, 61217, 61222, 61223, 61226, 61229, 61231, 61235, 61238, 61240, 61248, 61250, 61256,
  // 61261, 61264, 61265, 61266, 61268, 61269, 61272, 61273, 61274, 61275, 61279, 61281, 61283, 61284, 61286, 61289, 61296,
  // 61297, 61299, 61302, 61303, 61311, 61313, 61315, 61318, 61320, 61321, 61326, 61327, 61332, 61347, 61351, 61353, 61356,
  // 61358, 61360, 61361, 61366, 61371, 61373, 61376, 61377, 61378, 61381, 61384, 61389, 61402, 61412, 61423, 61427, 61429,
  // 61430, 61437, 61440, 61441, 61442, 61443, 61444, 61445, 61451, 61452, 61456, 61457, 61458, 61459, 61460, 61461, 61465,
  // 61471, 61472, 61476, 61478, 61479, 61485, 61488, 61490, 61492, 61494, 61504, 61511, 61512, 61524, 61531, 61532, 61533,
  // 61542, 61548, 61551, 61555, 61562, 61565, 61583, 61597, 61599, 61603, 61609, 61615, 61619, 61620, 61621, 61625, 61626,
  // 61627, 61632, 61636, 61652, 61662, 61667, 61674, 61687, 61688, 61697, 61699, 61715, 61721, 61722, 61724, 61729, 61737,
  // 61762, 61763, 61765, 61770, 61774, 61776, 61782, 61811, 61826, 61843, 61844, 61852, 61862, 61867, 61871, 61881, 61887,
  // 61889, 61893, 61905, 61907, 61911, 61912, 61913, 61918, 61921, 61923, 61925, 61926, 61927, 61932, 61934, 61935, 61937,
  // 61939, 61940, 61946, 61947, 61948, 61949, 61950, 61951, 61952, 61955, 61957, 61959, 61962, 61964, 61966, 61968, 61969,
  // 61971, 61972, 61975, 61978, 61979, 61982, 61983, 61984, 61987, 61988, 61991, 61992, 61994, 61996, 61999, 62000, 62002,
  // 62005, 62459, 62504, 62569, 62644, 62660, 62666, 62787, 62801, 62811, 62814, 62824, 62826, 62840, 62844, 62849, 62856,
  // 62860, 62861, 62863, 62866, 62869, 62875, 62876, 62877, 62878, 62891, 62892, 62894, 62898, 62904, 62909, 62910, 62923,
  // 62925, 62926, 62927, 62928, 62930, 62934, 62935, 62937, 62938, 62940, 62943, 62946, 62950, 62952, 62953, 62956, 62959,
  // 62963, 62964, 62973, 62980, 62981, 62982, 62983, 62995, 63010, 63011, 63012, 63018, 63032, 63034, 63042, 63044, 63045,
  // 63049, 63050, 63061, 63072, 63074, 63080, 63081, 63086,
]);
