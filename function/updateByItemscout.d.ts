export interface ItemscoutType extends ProductDesc, ProductShopDesc, Url {
  title: string; // "먹는 화이트 콜라겐 글루타치온정 / 글루타치온 필름";
  image: string; // "https://shopping-phinf.pstatic.net/main_8545538/85455382789.1.jpg";
  productId: number; // 85455382789;
  price: number; // 25900;
  category: string; // "식품>건강식품>영양제>기타건강보조식품";
  reviewCount: number | null; // 19;
  reviewScore: number | null; //5;
}

interface ProductShopDesc {
  mall: string | string[]; // "내추럴에너지";
  mallImg?: string | null;
  isOversea: boolean; //false; 해외상품여부
  isNaverShop: boolean; //true;
  isAd: boolean; //false; 광고상품여부
}

interface Url {
  pcProductUrl?: string; // "https://smartstore.naver.com/main/products/7910882466";
  mobileProductUrl?: string; // "https://m.smartstore.naver.com/main/products/7910882466";
}

interface ProductDesc {
  chnlSeq?: string; // "101266915";
  mallPids: any[];
  isException: boolean; //false;
  categoryStack: string[]; //["50000006", "50000023", "50001092", "50002615"];
  shop: string; // "내추럴에너지";
  isList: boolean; //false;
  link: string; // "https://cr.shopping.naver.com/adcr.nhn?x=wtjBMCrGLsrAGc7Cg26Rff%2F%2F%2Fw%3D%3DsToWAROJLWAm9lBY8fUVZG15kkg8rnUvVFF2CYM3qbe%2F0h%2F2qVbQ5fxVdm2fV5QlK2tuA2QSapXSAskfozcIpia5VfG%2BQgGSw3BwTR2vd476wWrMq%2FcjJHsqbzFW6JvYpO8ZynMCGVJfhR0GRmKKzIoTQFhMNCQrG%2ByyVwSaillfdNec4Cvj%2Ba%2BGQsrA34g6V74MKejG%2B3PlN3GNs%2B9u1EuF5XXMfA6yeW%2BDewuXpdPSlHO6CdBlfCNL7dP7AvkJUB7P9jx5KZr1oy9qstZx7m%2BhknlfUAPOotXNC5b9q%2BGYgg8geawgsFAeBjtbAqYZXknnpBql96m6NvKPxU4%2F6XEgmC2vQ3Q%2B3%2BJIRr63kzGoGi7sASWzN9Jh%2FDEnugn7w2w%2FtoziBb8byTNs33R1DdrQ1RMr%2BDnjJUmx4hWKXBwYYXoI8LxHJo2ztFMp9lOy02ufKqzvbH6ERCyFBa6hPY4%2FggSV1ptOCQAnkThOncXS1zoFFS2Ur5UiQh549tHz3xqO9JAAMKtHonrqqTK0ajzYhYCKekPCDvbTMF%2FwJQpff64w246l3ZvB0QC%2BHkctIoesC8VX2jGNYZ51aCpNCX6bKWcFznprRwoYt943aAzPke%2FVP%2BgM94BPZkP5YJ%2Bex&nvMid=85455382789&catId=50002615";
  mallPid: string | null; // "7910882466";
  multiShops: number; // 1;
  volume: number; // 0;
  openDate: string; // "20230113111422";
  purchaseCnt: number | null;
  keepCnt: number | null; //56;
  mallGrade: string | null; // "빅파워";
  deliveryFee: string; // "0";
  chnlSeqs: any[];
}

export interface ProductTable {
  is_init: boolean;
  keyword: string | null;
  keyword_id: number | null;
  itemscout_product_name: string;
  itemscout_product_image: string;
  itemscout_product_id: number;
  mall: string;
  itemscout_mall_img: string | null;
  price: number;
  category: string;
  is_naver_shop: number;
  store_link: string;
  store_name: string;
  review_count: number | null;
  review_score: number | null;
  delivery: string;
  pc_product_url: string | undefined;
  mobile_product_url: string | undefined;
  index: number;
  is_oversea: 0 | 1 | null;
}
