export const AuthorizationKey = () => {
  const time = String(new Date().getTime());
  return `dirldirlvkdlxld4${time}${time
    .split("")
    .map(Number)
    .reduce((n, p) => n + p, 0)
    .toString()
    .padStart(3, "0")}`;
};
