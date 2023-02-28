export type getAllProductIdType = {
  product_id: number; //19494;
  keyword_id: number | null; // '유한메디카';
  company_name: string | null; // '유한메디카';
  exception_keyword: string | null; //null;
  keyword: string | null; //'유한메디카 유한m 엽산플러스';
  naver_catalog_link: string | null; //null;
  product_name: string; //'유한m 엽산플러스';
  require_keyword: string | null; //null;
  type: "itemscout" | "naver";
};

export type ProductCompareKeywordResponseType = {
  resultList: {
    score: number;
    percent: string;
    keyword: string;
  }[];
  maxScore: number;
  minScore: number;
  avgScore: number;
  perfectScore: number;
};
