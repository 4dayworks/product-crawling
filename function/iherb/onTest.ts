import { l } from "../console";
import { wrapSlept } from "../wrapSlept";
import { getProductDescData } from "./getProductDescData";

export default async function onTest(list: { product_url: string; brand: string; list_url: string }[]) {
  for (let i = 0; i < list.length; i++) {
    const start_at = new Date();

    const product = list[i];
    const text = `product_id: ${product.product_url
      .slice(product.product_url.lastIndexOf("/") + 1, product.product_url.length)
      .padStart(6, " ")}, start_at: ${start_at.toISOString()}`;
    l(`[${i + 1}/${list.length}]`, "cyan", text);
    await getProductDescData(list[i]);

    // const end_at = new Date();
    // const wait_time = start_at.getTime() + 2000 - end_at.getTime();
    // if (wait_time > 0) await wrapSlept(2000);
    await wrapSlept(3000);
  }
}
