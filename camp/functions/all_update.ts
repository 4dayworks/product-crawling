import axios from "axios";
import { writeLog } from "../writeLog";
import { UpdateByProductIdType } from "./UpdateByProductIdType";
import { getKeywordByProductId, getProductIdList } from "./getProductIdList";
import { processProduct } from "./processProduct";
import { AuthorizationKey } from "../../function/auth";
import { NODE_API_URL_CAMP } from "../../function/common";
import { l } from "../../function/console";
import { wrapSlept } from "../../function/wrapSlept";

axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

export const updateByCampProduct = async ({
  page,
  size,
  productSelectedList,
  type,
  startIndex,
  processName,
  proxyIP,
  botId,
}: UpdateByProductIdType) => {
  // 1. 키워드 가져올 제품아이디 전체 가져오기
  let productIdListAll = await getProductIdList(page || 0, size || 1000000);
  if (!productIdListAll) return;
  // 2. 특정 제품만 가져오기 (없으면 전체 제품 대상)
  if (productSelectedList)
    productIdListAll = productIdListAll.filter((product_id) => productSelectedList.includes(product_id));
  if (productIdListAll.length === 0) return l("STOP", "red", "No product list to crawl.");

  let chance = 3; //다시 시도할 기회

  // 3. 가져온 제품별로 반복
  const max = productSelectedList ? productSelectedList.length : productIdListAll.length;
  for (let i = startIndex || 0; i < max; i++) {
    // 개별로 돌릴때 체크
    const index = i % productIdListAll.length;
    // 4. 제품 키워드 가져오기
    const product = await getKeywordByProductId(productIdListAll[index]);
    if (!product) {
      writeLog(processName || "Camp", `[Error] no product list: ${new Date().toISOString()}`);
      continue;
    }

    // 5. 메인 로직 돌리기
    const isSuccess = await processProduct(
      product,
      index,
      productIdListAll.length,
      type,
      processName || "Camp",
      botId || 0,
      proxyIP || "http://192.168.2.42:3001"
    );

    // 6. 로직 문제 시 처리
    if (!isSuccess) {
      chance--;
      if (chance <= 0) {
        // 마지막 기회 남아 일때 처리
        l("ERROR", "magenta", "No chances left! STOPPED!");
        writeLog(processName || "Camp", `[Error] No chances left! STOPPED!, ${new Date().toISOString()}`);
        const match = processName || "Camp".match(/_(\d+)_/);
        const bot_id = match ? parseInt(match[1], 10) : null;
        if (type === "all") {
          // 쿠팡 멈추기 (쿠팡은 2일 뒤 다시 실행)
          if (bot_id) await axios.patch(`${NODE_API_URL_CAMP}/crawling/bot/coupang_stop_until_at`, { bot_id: bot_id });
        } else {
          // 프로세스 잠깐 멈추기 1초 * 60 * 30 = 30분
          await wrapSlept(1000 * 60 * 30);
          // if (bot_id) await axios.patch(`${NODE_API_URL}/crawling/bot/status`, { bot_id: bot_id, status: "inactive" });
        }
        break;
      }
      // 프로세스 잠깐 멈추기 1초 * 60 * 10 = 10분
      await wrapSlept(1000 * 60 * 10);
      // 기회 남아 있을 때 오류 처리
      writeLog(processName || "Camp", `[Error] Remaining chances: ${chance}, ${new Date().toISOString()}`);
    } else {
      // 7. 문제 없을 시 되돌리기
      chance = 3;
    }
    i++;
  }
  l("[완료]", "blue", "모든 상품 가격 업데이트 완료");
  if (productSelectedList) return false;
  return true;
};
