export const isLocalhost = true; /// default: false

export const NODE_API_URL = isLocalhost ? "http://localhost:3001" : "https://node2.yagiyagi.kr";
export const toComma = (number: string | number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
