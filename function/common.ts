const isLocalhost = false;
const isTestDB = false;
export const NODE_API_URL = isLocalhost
  ? "http://localhost:3001"
  : isTestDB
  ? "https://node3.yagiyagi.kr"
  : "https://node2.yagiyagi.kr";
