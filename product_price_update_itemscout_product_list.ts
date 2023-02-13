import axios from "axios";
import { l } from "./function/console";
import { getProductByItemscout } from "./function/updateByItemscout";

const updateByItemscout = async (product_id_list: number[]) => {
  // (1) 키워드 가져올 제품아이디 전체 가져오기
  // GET /product/keyword
  const d1: {
    product_id: number; //34074;
    product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
  }[] = await axios(`https://node2.yagiyagi.kr/product/keyword?size=10000&page=0&is_expert_review=0`).then(
    (d) => d.data.data
  );
  const d2: {
    product_id: number; //34074;
    product_name: string; //'리얼메디 어린콜라겐 펩타이드 비오틴 100'
  }[] = await axios(`https://node2.yagiyagi.kr/product/keyword?size=10000&page=0&is_expert_review=1`).then(
    (d) => d.data.data
  );
  const list = [...d1, ...d2];

  for (let i = 0; i < list.length; i++) {
    const { product_id, product_name } = list[i];
    l("timestamp", "cyan", new Date().toISOString());
    if (product_id_list.includes(product_id)) await getProductByItemscout(product_id, product_name, i + 1, list.length);
  }

  l("[DONE]", "blue", "itemscout_keyword to product price");
};

updateByItemscout([309, 308, 307]);
