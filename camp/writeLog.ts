import fs from "fs/promises";

export const writeLog = async (processName: string, message: string) => {
  const logFilePath = `./camp/log/${processName}.log`; // 로그 파일 경로
  await fs.appendFile(logFilePath, message + "\n").catch((err) => console.error("Error writing log:", err));
};
