export type getAllProductIdType = {
  product_id: number; //19494;
  keyword_id: number | null; // '유한메디카';
  company_name: string | null; // '유한메디카';
  exception_keyword: string | null; //null;
  keyword: string | null; //'유한메디카 유한m 엽산플러스';
  naver_catalog_link: string | null; //null;
  product_name: string; //'유한m 엽산플러스';
  product_name_english: string | null; //'블루보넷 뉴트리션 완충형 킬레이트화 마그네슘';
  require_keyword: string | null; //null;
  type: "itemscout" | "naver" | "iherb";
  is_drugstore: 0 | 4 | null;

  iherb_keyword: string | null;
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
