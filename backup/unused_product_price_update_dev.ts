import { getAllProductIdType } from "../function/product_price_update";
import { getNaverCatalogStoreListV2 } from "../function/getNaverCatalogStoreListV2";
import { NODE_API_URL } from "../function/common";
import axios from "axios";
import { AuthorizationKey } from "../function/auth";
import { l } from "../function/console";
import { wrapSlept } from "../function/wrapSlept";
import { getItemscoutStoreListV2 } from "../function/getItemscoutStoreListV2";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateByProductIdDev = async (product_id_list?: number[]) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  let data: getAllProductIdType[] = await axios(`${NODE_API_URL}/crawling/product/all`).then((d) => d.data.data);

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) data = data.filter((p) => product_id_list.includes(p.product_id));

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    if (product.type === "itemscout") {
      await getItemscoutStoreListV2(product, i + 1, data.length);
      await wrapSlept(2000);
    } else if (product.type === "naver" && product.naver_catalog_link) {
      await getNaverCatalogStoreListV2(product, i + 1, data.length);
      await wrapSlept(2000);
    }
    l("timestamp", "cyan", new Date().toISOString());
  }
  l("[DONE]", "blue", "complete - all product price update");
};

// updateByProductIdDev([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateByProductIdDev(Array.from({ length: 100 }).map((a, i) => i + 1));
updateByProductIdDev([
  697, 907, 978, 1069, 4530, 4600, 4981, 5199, 5527, 5554, 5678, 5703, 5750, 6026, 6202, 6434, 6466, 6578, 6631, 6664,
  7166, 7198, 7424, 7545, 7626, 7640, 7759, 7830, 7929, 7932, 8176, 8219, 8370, 8433, 8540, 8547, 8641, 8706, 8779,
  8785, 8948, 9127, 9171, 9220, 9454, 9475, 9630, 9813, 9816, 10000, 10221, 10245, 10279, 10298, 10346, 10380, 10546,
  10734, 10762, 10803, 10841, 10882, 10900, 10933, 10934, 11103, 11495, 11583, 11690, 11704, 11809, 12294, 12916, 13511,
  13769, 13842, 13937, 14396, 14456, 15176, 15246, 15285, 16009, 17390, 18229, 18898, 20234, 22068, 22087, 23649, 28939,
  30441, 32625, 40383, 41292, 41574, 41776,
]);
