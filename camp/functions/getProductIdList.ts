import axios from "axios";
import { handleError } from "./handleError";
import { AuthorizationKey } from "../../function/auth";
import { NODE_API_URL_CAMP } from "../../function/common";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

export type ProductType = {
  product_id: number;
  itemscout_keyword: string | null;
  itemscout_keyword_require: string | null;
  itemscout_keyword_exception: string | null;
  coupang_keyword: string | null;
  coupang_keyword_require: string | null;
  coupang_keyword_exception: string | null;
  product_name: string | null;
  product_brand: string | null;
  product_color: string | null;
  naver_used_keyword: string | null;
  naver_used_keyword_require: string | null;
  naver_used_keyword_exception: string | null;
};

export const getProductIdList = async (page: number, size: number) => {
  try {
    const response = await axios.get<{ data: number[] }>(
      `${NODE_API_URL_CAMP}/crawling/product/id/list?page=${page}&size=${size}`
    );
    return response.data.data;
  } catch (err) {
    await handleError(err, "getProductIdList crawling/product/id/list ");
    return [];
  }
};

export const getKeywordByProductId = async (product_id: number): Promise<ProductType | null> => {
  try {
    const response = await axios.get<{ data: ProductType }>(
      `${NODE_API_URL_CAMP}/crawling/product/id?product_id=${product_id}`
    );
    return response.data.data;
  } catch (err) {
    await handleError(err, "getKeywordByProductId");
    return null;
  }
};
