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
exports.updateByNaverCatalog = void 0;
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
var request_1 = __importDefault(require("request"));
var console_1 = require("./console");
var wrapSlept_1 = require("./wrapSlept");
var getProductByNaverCatalog = function (productId, catalogUrl, index, max) {
    return new Promise(function (resolve) { return __awaiter(void 0, void 0, void 0, function () {
        var manualData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)("https://node2.yagiyagi.kr/product/price/manual?product_id=".concat(productId)).then(function (d) { return d.data.data; })];
                case 1:
                    manualData = _a.sent();
                    if (manualData && (manualData.is_drugstore === 1 || manualData.is_manual === 1)) {
                        if (manualData.is_drugstore === 1)
                            (0, console_1.l)("Pass", "green", "is_drugstore === 1, product_id:".concat(productId));
                        else if (manualData.is_manual === 1)
                            (0, console_1.l)("Pass", "green", "is_manual === 1, product_id:".concat(productId));
                        return [2 /*return*/, resolve(true)];
                    }
                    //#endregion
                    (0, request_1.default)(catalogUrl, function (error, response, body) {
                        if (error)
                            throw error;
                        var $ = cheerio_1.default.load(body);
                        try {
                            var storeList_1 = [];
                            var regex_1 = /[^0-9]/g;
                            var review_count = Number($("#__next > div > div > div > div > div > div > a").text().replace(regex_1, ""));
                            $("#section-price > ul > li").each(function (i, item) {
                                // 판매처이름
                                var idx = i + 1;
                                var store_name = $("#section-price > ul > li:nth-child(".concat(idx, ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)")).text();
                                // 판매처 제품가격
                                // #section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)
                                var priceStr = $("#section-price > ul > li:nth-child(".concat(idx, ") > div > div > div > span > span > em")).text();
                                var price = priceStr ? Number(priceStr.replace(regex_1, "")) : 0;
                                //판매처 배송비
                                var deliveryStr = $("#section-price > ul > li:nth-child(".concat(idx, ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)> span:nth-child(2)")).text();
                                var delivery = deliveryStr ? Number(deliveryStr.replace(regex_1, "")) : 0;
                                // 판매처링크
                                var store_link = $("#section-price > ul > li:nth-child(".concat(idx, ") > div:nth-child(1) > a")).attr("href");
                                storeList_1.push({
                                    product_id: productId,
                                    store_name: store_name,
                                    store_link: store_link,
                                    price: price,
                                    delivery: delivery,
                                });
                                (0, console_1.l)("GET", "green", "(".concat(idx.toString().padStart(2), ") id:").concat(productId.toString().padStart(5), " price:").concat(price
                                    .toString()
                                    .padStart(6), ", delivery: ").concat(delivery.toString().padStart(4), ", ").concat(store_name));
                                var data = { product_id: productId, store_name: store_name, store_link: store_link, store_index: idx, price: price, delivery: delivery };
                                axios_1.default.post("https://node2.yagiyagi.kr/product/catalog/id", data);
                            });
                            // 최저가 가져오기
                            var cheapStore = {
                                low_price: null,
                                index: null,
                                data: null,
                            };
                            for (var index_1 = 0; index_1 < storeList_1.length; index_1++) {
                                var data_1 = storeList_1[index_1];
                                var price = data_1.price ? data_1.price : 0;
                                if (cheapStore.index === null)
                                    cheapStore = { low_price: price, index: index_1, data: data_1 };
                                else if (cheapStore.low_price != null && cheapStore.low_price > price)
                                    cheapStore = { low_price: price, index: index_1, data: data_1 };
                            }
                            // DB Insert 최저가 데이터 넣기
                            if (!cheapStore.data)
                                return resolve(true);
                            var _a = cheapStore.data, product_id = _a.product_id, low_price = _a.price, delivery = _a.delivery, store_name = _a.store_name, store_link = _a.store_link;
                            if (!product_id || !low_price || !delivery || !store_name || !store_link)
                                return resolve(true);
                            var data = {
                                product_id: product_id,
                                low_price: low_price,
                                delivery: delivery,
                                store_name: store_name,
                                store_link: store_link,
                                review_count: review_count,
                                type: "naver",
                            };
                            var idx = cheapStore.index != null ? cheapStore.index + 1 : 0;
                            (0, console_1.l)("LowPrice", "cyan", "[".concat(index, "/").concat(max, "] (").concat(idx.toString().padStart(2), ") id:").concat(productId.toString().padStart(5), " price:").concat(low_price
                                .toString()
                                .padStart(6), ", delivery: ").concat(delivery.toString().padStart(4), ", ").concat(store_name));
                            axios_1.default
                                .post("https://node2.yagiyagi.kr/product/price", data)
                                .then(function () { return resolve(true); })
                                .catch(function () { return resolve(true); });
                        }
                        catch (error) {
                            (0, console_1.l)("error", "red", "[".concat(index, "/").concat(max, "] id:").concat(productId.toString().padStart(5)));
                            resolve(true);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); });
};
var updateByNaverCatalog = function (size, page) { return __awaiter(void 0, void 0, void 0, function () {
    var d, i, _a, product_id, naver_catalog_link;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, axios_1.default)("https://node2.yagiyagi.kr/product/catalog/url?size=".concat(size, "&page=").concat(page)).then(function (d) { return d.data.data; })];
            case 1:
                d = _b.sent();
                i = 0;
                _b.label = 2;
            case 2:
                if (!(i < d.length)) return [3 /*break*/, 6];
                _a = d[i], product_id = _a.product_id, naver_catalog_link = _a.naver_catalog_link;
                return [4 /*yield*/, getProductByNaverCatalog(product_id, naver_catalog_link, i + 1, d.length)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, wrapSlept_1.wrapSlept)(3000)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 2];
            case 6:
                (0, console_1.l)("[DONE]", "blue", "naver_catalog_link to product price");
                return [2 /*return*/];
        }
    });
}); };
exports.updateByNaverCatalog = updateByNaverCatalog;
