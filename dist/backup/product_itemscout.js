"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var axios_1 = __importDefault(require("axios"));
//#region 쿼리 짜기 함수
var writeQuery = function (content) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, fs_1.default.writeFileSync("./query.txt", content, { flag: "a+" })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var ifNull = function (str) {
    return str ? "'".concat(String(str).replace(/'/gi, "\\'").replace(/"/gi, '\\"'), "'") : "null";
};
var insertForm = function (_a) {
    var _b = _a.keyword, keyword = _b === void 0 ? null : _b, _c = _a.keyword_id, keyword_id = _c === void 0 ? -1 : _c, _d = _a.itemscout_product_name, itemscout_product_name = _d === void 0 ? null : _d, _e = _a.itemscout_product_image, itemscout_product_image = _e === void 0 ? null : _e, _f = _a.itemscout_product_id, itemscout_product_id = _f === void 0 ? null : _f, _g = _a.price, price = _g === void 0 ? null : _g, _h = _a.store_link, store_link = _h === void 0 ? null : _h, _j = _a.store_name, store_name = _j === void 0 ? null : _j, _k = _a.category, category = _k === void 0 ? null : _k, is_naver_shop = _a.is_naver_shop, _l = _a.mall, mall = _l === void 0 ? null : _l, _m = _a.review_count, review_count = _m === void 0 ? null : _m, _o = _a.review_score, review_score = _o === void 0 ? null : _o, _p = _a.delivery_fee, delivery_fee = _p === void 0 ? null : _p, pc_product_url = _a.pc_product_url, mobile_product_url = _a.mobile_product_url, index = _a.index;
    return "INSERT INTO F_DAYWORKS.product_itemscout_data \n(keyword, keyword_id, itemscout_product_name, itemscout_product_image, itemscout_product_id, \n  price, store_link, store_name, category, is_naver_shop, mall, review_count, review_score, delivery_fee, \n  pc_product_url, mobile_product_url, `index`) \n  VALUES(\n  ".concat(ifNull(keyword), ",\n  ").concat(ifNull(keyword_id), ",\n  ").concat(ifNull(itemscout_product_name), ",\n  ").concat(ifNull(itemscout_product_image), ",\n  ").concat(ifNull(itemscout_product_id), ",\n  ").concat(ifNull(price), ",\n  ").concat(ifNull(store_link), ",\n  ").concat(ifNull(store_name), ",\n  ").concat(ifNull(category), ",\n  ").concat(ifNull(is_naver_shop), ",\n  ").concat(ifNull(mall), ",\n  ").concat(ifNull(review_count), ",\n  ").concat(ifNull(review_score), ",\n  ").concat(ifNull(delivery_fee), ",\n  ").concat(ifNull(pc_product_url), ",\n  ").concat(ifNull(mobile_product_url), ",\n  ").concat(ifNull(index), ")\n ON DUPLICATE KEY UPDATE\nkeyword=").concat(ifNull(keyword), ",\nkeyword_id=").concat(ifNull(keyword_id), ",\nitemscout_product_name=").concat(ifNull(itemscout_product_name), ",\nitemscout_product_image=").concat(ifNull(itemscout_product_image), ",\nitemscout_product_id=").concat(ifNull(itemscout_product_id), ",\nprice=").concat(ifNull(price), ",\nstore_link=").concat(ifNull(store_link), ",\nstore_name=").concat(ifNull(store_name), ",\ncategory=").concat(ifNull(category), ",\nis_naver_shop=").concat(ifNull(is_naver_shop), ",\nmall=").concat(ifNull(mall), ",\nreview_count=").concat(ifNull(review_count), ",\nreview_score=").concat(ifNull(review_score), ",\ndelivery_fee=").concat(ifNull(delivery_fee), ",\npc_product_url=").concat(ifNull(pc_product_url), ",\nmobile_product_url=").concat(ifNull(mobile_product_url), ";\n");
};
//#endregion
//#region 메인 로직
var getData = function (keywordId) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var headers, productListResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = { "Accept-Encoding": "deflate, br" };
                    return [4 /*yield*/, (0, axios_1.default)("https://api.itemscout.io/api/v2/keyword/products?kid=".concat(keywordId, "&type=total"), { headers: headers })];
                case 1:
                    productListResult = (_a.sent()).data.data.productListResult;
                    resolve(productListResult);
                    return [2 /*return*/];
            }
        });
    }); });
};
var execute = function (keyword, keyword_id, index) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getData(keyword_id).then(function (d) {
                    return d
                        .filter(function (p) { return p.isAd === false && p.isOversea === false; })
                        .map(function (p, index) {
                        return {
                            keyword: keyword,
                            keyword_id: keyword_id,
                            itemscout_product_name: p.title,
                            itemscout_product_image: p.image,
                            itemscout_product_id: p.productId,
                            price: p.price,
                            category: p.category,
                            is_naver_shop: p.isNaverShop === true ? 1 : 0,
                            store_link: p.link,
                            store_name: p.shop,
                            mall: typeof p.mall === "string" ? p.mall : p.mall.join(","),
                            review_count: p.reviewCount,
                            review_score: p.reviewScore,
                            delivery_fee: p.deliveryFee,
                            pc_product_url: p.pcProductUrl,
                            mobile_product_url: p.mobileProductUrl,
                            index: index + 1,
                        };
                    });
                })];
            case 1:
                result = _a.sent();
                if (result && result.length)
                    result.map(function (p) { return writeQuery(insertForm(p)); });
                console.log("".concat(index, " keyword:"), keyword, keyword_id, " Complete !");
                return [2 /*return*/];
        }
    });
}); };
//#endregion
// 제외리스트
var exceptList = [];
// 찾을 리스트
var productList = [
    ["유한 코엔자임Q10", 349021813],
    ["닥터에스더 위케어 그린세라", 291075353],
    ["블랙킹 타임", 349018918],
    ["킨더츄 포도맛", 349022415],
    ["마더스 액상 철분", 247480734],
    ["진큐피에스(GinQPS)", 349022807],
    ["유한m 프리미엄 철분 엽산", 349023173],
    ["닥터에스더 식물성 알티지오메가3", 306513412],
    ["유한 코엔자임Q10", 349021813],
    ["닥터에스더 위케어 그린세라", 291075353],
    ["블랙킹 타임", 349018918],
    ["킨더츄 포도맛", 349022415],
    ["마더스 액상 철분", 247480734],
    ["진큐피에스(GinQPS)", 349022807],
    ["유한m 프리미엄 철분 엽산", 349023173],
    ["닥터에스더 식물성 알티지오메가3", 306513412],
    ["뉴트리코어 NCS 초임계 알티지 rtg 오메가3 834mg x 60캡슐 1개월분", 328478321],
    ["위&장 듀얼케어", 324954087],
    ["조아제약 오랄스프레이 프로폴리스 30ml", 349024399],
    ["조아제약 조아큐텐홍 1200mg x 60캡슐", 349024901],
    ["드시모네 팜 키즈", 306429769],
    ["비타블로썸 메가비타민C3000크리스탈", 349023021],
    ["드시모네 팜 베이비", 306429768],
    ["쏘팔메토 쏘팔옥타코펜 4종 기능성 고함량 2개월(60캡슐) 2개월 (60캡슐)", 349025531],
    ["닥터에스더 어린콜라겐 비오틴 플러스", 304215183],
    ["VITAMIN D 5000IU", 274381591],
    ["닥터 퍼스트 맘 오메가3 (60캡슐) 1개", 330871523],
    ["NatureWith 더오메가3", 349027085],
    ["재로우 우먼스 펨 도필러스 프로바이오틱스 유산균", 298199702],
    ["조인트 엠에스엠 9988", 349027453],
    ["드시모네 4500억", 283549063],
    ["마더스셀렌효모골드", 49372812],
    ["유한 식물성MSM 플러스", 349027795],
    ["눈건강 슈퍼 루테인 골드", 251510507],
    ["보령 보령제약 브링 식물성 알티지 오메가3 60캡슐", 349028313],
    ["하루 건강애(愛) 딱이야", 349031385],
    ["맥스컷 다이어트 부스터3.1", 313283973],
    ["오메가3 슈퍼골드 1100", 349031766],
    ["장 비움 프로젝트", 311489482],
    ["눈에좋은 마더스 메가아스테인", 244092142],
    ["프로진프로폴리스아연", 306027867],
    ["액티브라이프 눈건강", 243980520],
    ["유한 알티지 식물성오메가3", 248237718],
    ["닥터 써니디 드롭스 1000IU", 249217509],
    ["관절연골엔보스웰리아", 5499654],
    ["모마네 이너젠(Momane Inner Gen)", 304230555],
    ["모마네 파워퍼플(Momane Power Purple)", 309065945],
    ["람노플 여성 유산균", 302186667],
    ["일양약품 비타민D3 4000IU 프리미엄 120캡슐", 349032598],
    ["아이사랑 슈퍼면역젤리 엘더베리맛", 266316488],
    ["한미프로폴리스골드", 52219297],
    ["브레인 파워 1080", 349033091],
    ["드시모네365 포도향", 265133189],
    ["인사비트 골드 플러스", 266457025],
    ["징크드롭", 5566883],
    ["지디 다이어트 시너지컷", 304419150],
    ["re-GEN 엠에스엠", 349033562],
    ["한미루테인맥스(MAX)", 237479577],
    ["마그 징코 매니아 플러스", 349033740],
    ["프로락 정", 306298317],
    ["엘리나 C", 349034480],
    ["방광의 배뇨기능 개선에 도움을 줄 수 있는 YO(요)", 245617749],
    ["리버락골드캡슐", 101674926],
    ["데일리베스트 종합비타민 미네랄 츄잉정", 247618138],
];
var wrapSlept = function (sec) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, sec); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
// 메인로직
// const f = async () => {
//   const max = 3; //productList.length;
//   for (let i = 0; i < max; i++) {
//     const [keyword, keyword_id] = productList[i];
//     if (!exceptList.includes(keyword_id)) {
//       if (i != 0) await wrapSlept(1002);
//       execute(keyword, keyword_id, `[${i + 1}/${max}]`);
//     }
//     if (i === max - 1) {
//       await wrapSlept(100);
//       console.log(`[${max}/${max}] Done!`);
//     }
//   }
// };
// f();
// 야기DB product_name / keyword 가져오기
var getYagiProduct = function (page) { return __awaiter(void 0, void 0, void 0, function () {
    var url, d;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = "https://node2.yagiyagi.kr/product/keyword?size=100&page=".concat(page);
                return [4 /*yield*/, axios_1.default.get(url).then(function (d) { return d.data.data; })];
            case 1:
                d = _a.sent();
                d.map(function (_a, i, arr) {
                    var keyword = _a.keyword, keyword_id = _a.keyword_id, product_name = _a.product_name, product_id = _a.product_id;
                    return __awaiter(void 0, void 0, void 0, function () {
                        var search_keyword, url_1, headers, itemscout_keyword_id, is_manual;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    if (!(keyword_id == null && product_id < 4)) return [3 /*break*/, 4];
                                    search_keyword = keyword || product_name;
                                    if (!search_keyword)
                                        return [2 /*return*/];
                                    url_1 = "https://api.itemscout.io/api/keyword";
                                    headers = { "Accept-Encoding": "deflate, br" };
                                    return [4 /*yield*/, axios_1.default
                                            .post(url_1, { keyword: search_keyword }, { headers: headers })
                                            .then(function (d) { return d.data.data; })];
                                case 1:
                                    itemscout_keyword_id = _b.sent();
                                    console.log("[".concat(i + 1, "/").concat(arr.length, "]"), "search_keyword:", search_keyword, "itemscout_keyword_id:", itemscout_keyword_id);
                                    is_manual = product_name !== search_keyword ? 1 : 0;
                                    return [4 /*yield*/, axios_1.default.post("https://node2.yagiyagi.kr/product/keyword/id", {
                                            keyword: search_keyword,
                                            keyword_id: keyword_id,
                                            product_id: product_id,
                                            is_manual: is_manual,
                                        })];
                                case 2:
                                    _b.sent();
                                    return [4 /*yield*/, wrapSlept(300)];
                                case 3:
                                    _b.sent();
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [2 /*return*/];
        }
    });
}); };
getYagiProduct(0);
