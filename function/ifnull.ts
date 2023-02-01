export const ifNull = (str?: string | number | null) =>
  str ? `\'${String(str).replace(/'/gi, "\\'").replace(/"/gi, '\\"')}\'` : "null";
