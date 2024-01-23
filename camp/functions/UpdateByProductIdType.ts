export type UpdateByProductIdType = {
  page?: number;
  size?: number;
  productSelectedList?: number[];
  startIndex?: number;
  instanceData?: {
    startIndex: number | undefined;
    instance_name: string | undefined;
  };
  type: "all" | "only-itemscout-naver";
  waitTime?: number;
  processName?: string;
  botId?: number;
  proxyIP?: string;
};
