export type IherbProductPriceType1 = {
  recommendedProducts: ProductDetailType[]; //2개씩 오는듯
  originProduct: ProductDetailType | null;
};
export type IherbProductPriceType2 = {
  id: number; //115008;
  special: {
    discountPercentage: number; //20;
    discountPrice: number; //11152;
    quantityLimit: number; //0;
    isInCartDiscount: boolean; //false;
  } | null;
  trial: null;
  clearance: null;
  volume: null;
  combo: null;
  autoApplyPromo: null;
  subscription: {
    discountPercentage: number; //5;
    firstTimeSubscriberPercent: number; //0.05;
    recurringOrderPercent: number; //0.05;
    discountedPrice: { value: number; formatted: string };
    defaultFrequencyId: string; //"297691e6-75f6-4ae0-9e65-1fbcaada72d9";
    isFirstTimeSubscriber: true;
    activeSubscriptionId: null;
    nextDeliveryDate: null;
    activeSubscriptionUrl: null;
    frequencies: any[];
    content: Object;
    pricePerUnit: string; //"₩42/개";
    salePrice: Object;
    displayType: number; //0;
    defaultSelectionIsEnabled: false;
  } | null;
};
export type ErrorType = {
  errorMessage: "Product does not exist or is inactive. productId: 43826";
  errorType: 0;
};
type ProductDetailType = {
  id: number; //43724;
  name: string; //"21st Century, 비오틴, 800mcg, 삼키기 쉬운 정제 110정";
  partNumber: string; //"CEN22881";
  url: string; //"https://kr.iherb.com/pr/21st-century-biotin-800-mcg-110-easy-swallow-tablets/43724";
  brandCode: string; //"CEN";
  brandName: string; //"21st Century";
  primaryImageIndex: number; //39;
  rating: number; //4.7;
  ratingCount: number; //12977;
  ratingUrl: string; //"https://kr.iherb.com/pr/21st-century-biotin-800-mcg-110-easy-swallow-tablets/43724#product-detail-reviews";
  reviewUrl: string; //"https://kr.iherb.com/r/21st-century-biotin-800-mcg-110-easy-swallow-tablets/43724";
  listPrice: string | null; //"₩2,840";
  discountedPrice: string; //"₩2,840";
  discountedPriceAmount: number; //2840;
  hidePrice: boolean; //false;
  productFlag: null;
  discountType: number; // 0;
  isInCartDiscount: boolean; //false;
  salesDiscountPercentage: number; // 0;
  specialDealInfo: null;
  ratingStarsMap: number[]; // [Array]; 1,1,1,1,0.75 이렇게 오면 4.75점임
  isInGroup: boolean; //false;
  currencySymbol: string; //"₩";
  isCurrencySymbolOnLeft: boolean; //true;
};

export type ProductType = {
  id: number; // 112055;
  displayName: string; // "이뮨 액티브, Protectis 캡슐, 2,000IU, 프로바이오틱 캡슐 60정";
  isAvailableToPurchase: false;
  partNumber: string; //"BGA-46041";
  rootCategoryId: number; // 1855;
  rootCategoryName: string; //"보충제";
  url: string; //"https://kr.iherb.com/pr/biogaia-immune-active-protectis-capsules-2-000-iu-60-probiotic-capsules/112055";
  urlName: string; //"biogaia-immune-active-protectis-capsules-2-000-iu-60-probiotic-capsules";
  discountPrice: string; //"₩47,536";
  listPrice: string; //"₩47,536";
  brandCode: string; //"BGA";
  brandName: string; //"BioGaia";
  brandLogoUrl: string; //"https://s3.images-iherb.com/brand/logo/BGA/1642526326.jpg";
  brandUrl: string; //"https://kr.iherb.com/c/biogaia";
  primaryImageIndex: number; //12;
};

export type productURLDataType = {
  list_url: string;
  product_url: string;
  brand: string;
};

export type IherbType = {
  iherb_product_id: string;
  iherb_product_name: string | null;
  iherb_product_brand: string | null;
  iherb_product_image: string | null;
  is_stock: string;
  discount_price: string | null;
  is_delivery_event: string;
  rank: string;
  delivery_price: number | null;
  description: string;
  description_use: string | null;
  description_other_ingredient: string | null;
  description_warn: string | null;
  ingredient_amount: string;
  ingredient_raw: string;
  ingredient_count: string;
  rating: string | null;
  review_count: string | null;
  review_url: string | null;
  list_url: string;
  product_url: string;
  primary_ingredients: string;
  func_content: string | null;
};
