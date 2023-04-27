import { getProductByNaverCatalogV2 } from "./function/getProductByNaverCatalogV2";
import { NODE_API_URL } from "./function/common";
import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { l } from "./function/console";
import { wrapSlept } from "./function/wrapSlept";
import { getProductByItemscoutV2 } from "./function/updateByItemscoutV2";
import { setGraph, setLastMonthLowPrice, shuffle } from "./function/product";
import { getAllProductIdType } from "./product_price_update.d";
import { getProductPriceData } from "./function/updateByIherb";
import { IherbPriceType } from "./product_price_update_itemscout";

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
    } else if (product.type === "naver" && product.naver_catalog_link) {
      await getProductByNaverCatalogV2(product, i + 1, data.length);
      await wrapSlept(2000);
    }
    await setGraph(product);
    await setLastMonthLowPrice(product);
    l("timestamp", "cyan", new Date().toISOString());
  }
  l("[DONE]", "blue", "complete - all product price update");
};

// updateByProductId([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateByProductId(Array.from({ length: 100 }).map((a, i) => i + 1));
updateByProductId([
  60159, 60181, 60264, 60634, 60668, 60671, 60721, 60793, 60794, 60796, 60797, 60798, 60799, 60800, 60801, 60802, 60804,
  60808, 60809, 60810, 60811, 60813, 60814, 60815, 60817, 60818, 60820, 60822, 60823, 60825, 60826, 60827, 60828, 60830,
  60831, 60832, 60833, 60834, 60835, 60836, 60837, 60845, 60846, 60848, 60849, 60851, 60854, 60856, 60858, 60859, 60860,
  60861, 60862, 60863, 60864, 60865, 60866, 60867, 60869, 60871, 60872, 60873, 60874, 60878, 60879, 60880, 60881, 60882,
  60883, 60884, 60886, 60888, 60891, 60895, 60901, 60903, 60904, 60906, 60908, 60909, 60910, 60912, 60913, 60914, 60918,
  60919, 60920, 60923, 60924, 60926, 60927, 60933, 60934, 60937, 60938, 60940, 60943, 60946, 60982, 61038, 61061, 61072,
  61074, 61075, 61076, 61077, 61079, 61080, 61082, 61083, 61084, 61085, 61086, 61090, 61093, 61095, 61096, 61099, 61100,
  61103, 61107, 61110, 61111, 61113, 61114, 61119, 61125, 61135, 61138, 61141, 61142, 61143, 61145, 61146, 61147, 61148,
  61158, 61164, 61170, 61172, 61179, 61180, 61183, 61191, 61194, 61202, 61203, 61205, 61208, 61211, 61216, 61217, 61218,
  61219, 61220, 61221, 61222, 61223, 61224, 61225, 61226, 61227, 61228, 61231, 61233, 61234, 61235, 61236, 61237, 61238,
  61239, 61240, 61244, 61245, 61246, 61247, 61248, 61251, 61252, 61256, 61261, 61262, 61264, 61265, 61266, 61268, 61269,
  61272, 61274, 61275, 61279, 61281, 61283, 61284, 61289, 61295, 61296, 61297, 61311, 61313, 61368, 61369, 61370, 61371,
  61372, 61373, 61375, 61376, 61377, 61378, 61379, 61380, 61381, 61382, 61384, 61385, 61386, 61388, 61389, 61390, 61391,
  61392, 61393, 61395, 61397, 61399, 61400, 61401, 61403, 61404, 61405, 61407, 61408, 61409, 61410, 61411, 61413, 61415,
  61417, 61419, 61420, 61421, 61425, 61434, 61436, 61443, 61447, 61478, 61483, 61532, 61555, 61556, 61557, 61559, 61560,
  61561, 61562, 61563, 61564, 61565, 61566, 61568, 61571, 61572, 61573, 61574, 61575, 61577, 61578, 61580, 61581, 61582,
  61583, 61585, 61586, 61587, 61588, 61589, 61590, 61591, 61592, 61594, 61596, 61602, 61613, 61616, 61633, 61635, 61648,
  61649, 61650, 61653, 61663, 61666, 61681, 61697, 61710, 61740, 61870, 61872, 61905, 61906, 61907, 61908, 61909, 61910,
  61911, 61914, 61917, 61918, 61920, 61922, 61923, 61925, 61926, 61927, 61928, 61929, 61931, 61932, 61933, 61934, 61936,
  61938, 61939, 61942, 61943, 61948, 61952, 61954, 61955, 61956, 61958, 61960, 61961, 61962, 61963, 61965, 61970, 61971,
  61974, 61976, 61977, 61979, 61981, 61993, 61994, 61995, 61997, 62000, 62420, 62421, 62422, 62423, 62424, 62425, 62427,
  62428, 62429, 62433, 62437, 62440, 62449, 62452, 62453, 62457, 62462, 62477, 62478, 62480, 62484, 62493, 62494, 62500,
  62510, 62517, 62519, 62522, 62526, 62527, 62537, 62541, 62551, 62552, 62555, 62567, 62573, 62589, 62710, 62733, 62766,
  62773, 62777, 62823, 62824, 62825, 62828, 62829, 62847, 62893, 62896, 62898, 62906, 62907, 62908, 62912, 62913, 62914,
  62915, 62919, 62920, 62921, 62923, 62928, 62929, 62930, 62937, 62943, 62945, 62949, 62950, 62951, 62953, 62954, 62971,
  62972, 62973, 62974, 62975, 62976, 62979, 62980, 62987, 62989, 62991, 62994, 63010, 63013, 63014, 63021, 63026, 63027,
  63030, 63036, 63038, 63040, 63045, 63046, 63111, 63122, 63123, 63124, 63125, 63126, 63128, 63129, 63130, 63131, 63132,
  63133, 63134, 63135, 63137, 63138, 63139, 63140, 63142, 63143, 63144, 63145, 63146, 63150, 63151, 63152, 63154, 63155,
  63157, 63160, 63162, 63163, 63165, 63166, 63172, 63173, 63179, 63195, 63197, 63202, 63209, 63227, 63235, 63249, 63270,
  63273, 63293, 63335, 63355, 63371, 63415, 66373, 66374, 66375, 66376, 66377, 66378,
]);
