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
exports.updateByItemscout = void 0;
var axios_1 = __importDefault(require("axios"));
var console_1 = require("./console");
var getProductByItemscout = function (product_id, product_name, index, max) {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var manualData, originData_1, keyword_id_1, keyword_1, url, headers_1, itemscout_keyword_id, url, headers_2, itemscout_keyword_id, url, headers_3, itemscout_keyword_id, headers, isExceptionKeyword_1, productListResult, storeList, lowPriceObj, idx, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 17, , 18]);
                    return [4 /*yield*/, (0, axios_1.default)("https://node2.yagiyagi.kr/product/price/manual?product_id=".concat(product_id)).then(function (d) { return d.data.data; })];
                case 1:
                    manualData = _a.sent();
                    if (manualData && (manualData.is_drugstore === 1 || manualData.is_manual === 1)) {
                        if (manualData.is_drugstore === 1)
                            (0, console_1.l)("Pass", "green", "is_drugstore === 1, product_id:".concat(product_id));
                        else if (manualData.is_manual === 1)
                            (0, console_1.l)("Pass", "green", "is_manual === 1, product_id:".concat(product_id));
                        return [2 /*return*/, resolve(true)];
                    }
                    return [4 /*yield*/, (0, axios_1.default)("https://node2.yagiyagi.kr/product/keyword/id?product_id=".concat(product_id)).then(function (d) { return d.data.data; })];
                case 2:
                    originData_1 = _a.sent();
                    keyword_id_1 = originData_1 && originData_1.keyword_id ? originData_1.keyword_id : null;
                    keyword_1 = originData_1 && originData_1.keyword ? originData_1.keyword : null;
                    if (!(originData_1 === null)) return [3 /*break*/, 5];
                    url = "https://api.itemscout.io/api/keyword";
                    headers_1 = { "Accept-Encoding": "deflate, br" };
                    return [4 /*yield*/, axios_1.default
                            .post(url, { keyword: product_name }, { headers: headers_1 })
                            .then(function (d) { return d.data.data; })];
                case 3:
                    itemscout_keyword_id = _a.sent();
                    // 야기DB에 저장
                    keyword_id_1 = itemscout_keyword_id;
                    keyword_1 = product_name;
                    return [4 /*yield*/, axios_1.default.post("https://node2.yagiyagi.kr/product/keyword/id", {
                            keyword: product_name,
                            keyword_id: itemscout_keyword_id,
                            yagi_product_id: product_id,
                        })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 11];
                case 5:
                    if (!(originData_1.keyword && originData_1.keyword_id === null)) return [3 /*break*/, 8];
                    url = "https://api.itemscout.io/api/keyword";
                    headers_2 = { "Accept-Encoding": "deflate, br" };
                    return [4 /*yield*/, axios_1.default
                            .post(url, { keyword: originData_1.keyword }, { headers: headers_2 })
                            .then(function (d) { return d.data.data; })];
                case 6:
                    itemscout_keyword_id = _a.sent();
                    keyword_id_1 = itemscout_keyword_id;
                    keyword_1 = originData_1.keyword;
                    // 야기DB keyword, keyword_id 업데이트
                    return [4 /*yield*/, axios_1.default.patch("https://node2.yagiyagi.kr/product/keyword/id", {
                            keyword: originData_1.keyword,
                            keyword_id: itemscout_keyword_id,
                            yagi_product_id: product_id,
                        })];
                case 7:
                    // 야기DB keyword, keyword_id 업데이트
                    _a.sent();
                    return [3 /*break*/, 11];
                case 8:
                    if (!(originData_1.keyword_id === null)) return [3 /*break*/, 11];
                    url = "https://api.itemscout.io/api/keyword";
                    headers_3 = { "Accept-Encoding": "deflate, br" };
                    return [4 /*yield*/, axios_1.default
                            .post(url, { keyword: product_name }, { headers: headers_3 })
                            .then(function (d) { return d.data.data; })];
                case 9:
                    itemscout_keyword_id = _a.sent();
                    // 야기DB keyword_id 업데이트
                    keyword_id_1 = itemscout_keyword_id;
                    keyword_1 = product_name;
                    return [4 /*yield*/, axios_1.default.patch("https://node2.yagiyagi.kr/product/keyword/id", {
                            keyword: product_name,
                            keyword_id: itemscout_keyword_id,
                            yagi_product_id: product_id,
                        })];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    //#endregion
                    //#region (3) itemscout에서 keyword_id 로 검색해서 집어넣기
                    if (!keyword_id_1) {
                        (0, console_1.l)("Err", "red", "No keywrod_id product_id:".concat(product_id));
                        return [2 /*return*/, resolve(true)];
                    }
                    headers = { "Accept-Encoding": "deflate, br" };
                    isExceptionKeyword_1 = function (title) {
                        if (!originData_1 || !originData_1.exception_keyword)
                            return false;
                        if (title)
                            return title.includes(originData_1.exception_keyword);
                        return false;
                    };
                    return [4 /*yield*/, (0, axios_1.default)("https://api.itemscout.io/api/v2/keyword/products?kid=".concat(keyword_id_1, "&type=total"), { headers: headers }).then(function (d) {
                            return d.data.data.productListResult.filter(function (p) { return p.isAd === false && p.isOversea === false && !isExceptionKeyword_1(p.title); });
                        })];
                case 12:
                    productListResult = _a.sent();
                    return [4 /*yield*/, productListResult.map(function (p, i) {
                            return {
                                index: i + 1,
                                keyword: keyword_1,
                                keyword_id: keyword_id_1,
                                itemscout_product_name: p.title,
                                itemscout_product_image: p.image,
                                itemscout_product_id: p.productId,
                                price: p.price,
                                store_link: p.link,
                                store_name: p.shop,
                                category: p.category,
                                is_naver_shop: p.isNaverShop === true ? 1 : 0,
                                mall: typeof p.mall === "string" ? p.mall : p.mall.join(","),
                                itemscout_mall_img: p.mallImg ? p.mallImg : null,
                                review_count: p.reviewCount,
                                review_score: p.reviewScore,
                                delivery: p.deliveryFee,
                                pc_product_url: p.pcProductUrl,
                                mobile_product_url: p.mobileProductUrl,
                                is_oversea: p.isOversea === false ? 0 : p.isOversea === true ? 1 : null,
                            };
                        })];
                case 13:
                    storeList = _a.sent();
                    if (!(storeList && storeList.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, axios_1.default.post("https://node2.yagiyagi.kr/v2/product/keyword/data", { data: storeList, keyword_id: keyword_id_1 })];
                case 14:
                    _a.sent();
                    return [3 /*break*/, 16];
                case 15:
                    (0, console_1.l)("Pass", "green", "No Store(\uD310\uB9E4\uCC98) product_id:".concat(product_id, ", keyword:").concat(keyword_1, ", keyword_id=").concat(keyword_id_1));
                    return [2 /*return*/, resolve(true)];
                case 16:
                    lowPriceObj = productListResult && productListResult.length
                        ? productListResult.reduce(function (prev, value) { return (prev.price <= value.price ? prev : value); })
                        : null;
                    idx = index + 1;
                    if (!lowPriceObj) {
                        (0, console_1.l)("LowPrice", "blue", "[".concat(index, "/").concat(max, "] (").concat(idx.toString().padStart(2), ") id:").concat(product_id
                            .toString()
                            .padStart(5), " price: NO Price, delivery: No Delivery, No Store"));
                        return [2 /*return*/, resolve(true)];
                    }
                    data = {
                        product_id: product_id,
                        low_price: lowPriceObj.price,
                        delivery: lowPriceObj.deliveryFee ? lowPriceObj.deliveryFee : 0,
                        store_name: typeof lowPriceObj.mall !== "string" && lowPriceObj.isNaverShop ? "네이버 브랜드 카탈로그" : lowPriceObj.mall,
                        store_link: lowPriceObj.link,
                        review_count: lowPriceObj.reviewCount,
                        type: "itemscout",
                    };
                    (0, console_1.l)("LowPrice", "blue", "[".concat(index, "/").concat(max, "] (").concat(idx.toString().padStart(2), ") id:").concat(product_id
                        .toString()
                        .padStart(5), " price:").concat(data.low_price.toString().padStart(6), ", delivery: ").concat(data.delivery
                        .toString()
                        .padStart(4), ", ").concat(data.store_name));
                    axios_1.default
                        .post("https://node2.yagiyagi.kr/product/price", data)
                        .then(function () { return resolve(true); })
                        .catch(function () { return resolve(true); });
                    return [3 /*break*/, 18];
                case 17:
                    error_1 = _a.sent();
                    (0, console_1.l)("error", "red", product_id.toString() + product_name + index.toString() + max);
                    resolve(true);
                    return [3 /*break*/, 18];
                case 18: return [2 /*return*/];
            }
        });
    }); });
};
// 2. 아이템스카우트 데이터가져오기 & 야기 DB procude_price에 반영
// 네이버카탈로그 url 있으면 안가져오고 넘김.
// is_expert_review 가 있는지 없는지 비교해서 실행함.
var updateByItemscout = function (size, page, is_expert_review) { return __awaiter(void 0, void 0, void 0, function () {
    var d, i, _a, product_id, product_name;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, axios_1.default)("https://node2.yagiyagi.kr/product/keyword?size=".concat(size, "&page=").concat(page, "&is_expert_review=").concat(is_expert_review ? 1 : 0)).then(function (d) { return d.data.data; })];
            case 1:
                d = _b.sent();
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < d.length)) return [3 /*break*/, 5];
                _a = d[i], product_id = _a.product_id, product_name = _a.product_name;
                return [4 /*yield*/, getProductByItemscout(product_id, product_name, i + 1, d.length)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                i++;
                return [3 /*break*/, 2];
            case 5:
                (0, console_1.l)("[DONE]", "blue", "itemscout_keyword to product price");
                return [2 /*return*/];
        }
    });
}); };
exports.updateByItemscout = updateByItemscout;
