export const isLocalhost = false; /// default: false
const isTestDB = true;
export const NODE_API_URL = isLocalhost
  ? "http://localhost:3001"
  : isTestDB
  ? "https://node3.yagiyagi.kr"
  : "https://node2.yagiyagi.kr";
export const toComma = (number: string | number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
