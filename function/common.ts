export const isLocalhost = false; /// default: false

export const NODE_API_URL_YAGI = isLocalhost ? "http://localhost:3001" : "https://node2.yagiyagi.kr";
export const NODE_API_URL_CAMP = isLocalhost ? "http://localhost:4001" : "https://node5.yagiyagi.kr";
export const toComma = (number: string | number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
