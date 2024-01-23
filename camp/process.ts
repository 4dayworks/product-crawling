// import { updateByCampProduct } from "./functions/all_update";
// import { writeLog } from "./writeLog";

// // 기본 변수
// const ip: string = process.argv[2];
// const processName: string = process.argv[3]; // 새로 추가
// const match = !processName ? "" : processName.match(/^bot_(\d+)_/); // 정규식을 사용하여 bot_id 추출
// const botId = match ? parseInt(match[1], 10) : 0;

// // processName에서 _s(start_index)와 _c(is_request_coupang) 뒤의 값을 추출
// const sMatch = !processName ? "" : processName.match(/_s(\d+)/);
// const cMatch = !processName ? "" : processName.match(/_c(\d)/);
// const startIndex = sMatch && sMatch[1] ? parseInt(sMatch[1], 10) : 0;

// const isRequestCoupang = cMatch && cMatch[1] === "1" ? true : false;

// // 크롤링 시작
// const executeCrawling = async function (ip: string) {
//   // 로그 시작 메시지 작성
//   writeLog(processName, `[info] start bot start_at: ${new Date().toISOString()}`);
//   while (true) {
//     writeLog(processName, `[info] start bot crawling_start_at: ${new Date().toISOString()}`);
//     await updateByCampProduct({
//       type: isRequestCoupang ? "all" : "only-itemscout-naver",
//       startIndex: isRequestCoupang ? startIndex : 0,
//       processName,
//       productSelectedList: [1],
//       proxyIP: "http://34.64.180.61:3001",
//       botId: botId,
//     });
//     writeLog(processName, `[info] start bot crawling_end_at: ${new Date().toISOString()}`);
//   }
// };

// // executeCrawling(ip);
