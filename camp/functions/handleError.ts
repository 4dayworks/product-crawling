import { l } from "../../function/console";

export const handleError = async (err: any, message: string) => {
  if (err?.response?.status === 502) l("502 Error", "red", err.message);
  else l("Axios Error", "red", message + err.message);
};
