export const wrapSlept = async (sec: number) => await new Promise((resolve) => setTimeout(resolve, sec));
