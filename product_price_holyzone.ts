import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL, toComma } from "./function/common";
import { l } from "./function/console";
import { wrapSlept } from "./function/wrapSlept";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const updateHolyzone = async (product_id_list?: number[]) => {
  // (1) 성지가격있는 제품아이디 전체 가져오기
  let data: { product_id: number; product_name: string }[] = await axios(
    `${NODE_API_URL}/crawling/product/holyzone/all`
  )
    .then((d) => d.data.data)
    .catch((e) => l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/all" + e.code));

  // 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (product_id_list) data = data.filter((p) => product_id_list.includes(p.product_id));

  for (let i = 0; i < data.length; i++) {
    const product = data[i];
    //#region 특정 제품 최저가 갱신 및 푸쉬보낼 user_id 가져오기
    const data2: { user_id: number; low_price: number }[] = await axios
      .post(`${NODE_API_URL}/crawling/product/holyzone/notification`, { product_id: product.product_id })
      .then((d) => d.data.data)
      .catch((e) => l("Noti Err", "red", "성지존 알림 오류 /crawling/product/holyzone/notification" + e.code));

    //#endregion
    //#region 제품 최저가 갱신시 유저에게 알림 보내기
    if (data2.length > 0 && data2[0].low_price && data2[0].low_price > 1000) {
      const userList: string[] = data2.map((d) => String(d.user_id));
      if (userList && userList.length > 0) {
        await axios
          .get(
            `${NODE_API_URL}/user/firebase/send/low_price?user_list=${userList}&title=야기야기&message=내가 관심을 보인 ${
              product.product_name
            } 가격이 ${toComma(data2[0].low_price)}원으로 내려갔어요⬇️&link=/product/${product.product_id}`
          )
          .catch((e) => l("Noti Err", "red", "성지존 알림 오류 /user/firebase/send/low_price " + e.code));
      }
      await wrapSlept(2000);
    }
    //#endregion
    l("timestamp", "cyan", "product_id:" + product.product_id + ", " + new Date().toISOString());
  }
  l("[DONE]", "blue", "complete - all product sending notification complete");
};

// updateNotification([37327, 11191, 28560, 11311, 11775, 12166, 17697]);
// updateNotification(Array.from({ length: 100 }).map((a, i) => i + 1));
updateHolyzone();
