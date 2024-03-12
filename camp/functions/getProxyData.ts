import axios from "axios";
import { l } from "../../function/console";

// url, body, header, method
export async function getProxyData(
  bot_id: number,
  proxyIP: string,
  url: string,
  method = "GET",
  header?: any,
  body?: object
) {
  const params: any = { url, method };
  if (header) params.header = header;
  if (body) params.body = body;

  return await axios.post(proxyIP, params).catch((e) => {
    l("Err", "red", "getProxyData " + e.message);
    throw Error("getProxyData Error " + proxyIP + ", " + params.url + ", " + +e.message);
  });
}
