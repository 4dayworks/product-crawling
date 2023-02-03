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
var cheerio_1 = __importDefault(require("cheerio"));
var fs_1 = __importDefault(require("fs"));
var request_1 = __importDefault(require("request"));
var lodash_1 = __importDefault(require("lodash"));
var log = console.log;
var getUniqDomainList = function (domainList) {
    return lodash_1.default.uniq(domainList.map(function (item) {
        return item
            .split("/")
            .filter(function (s, i) { return i > 1 && i < 3; })
            .join("/");
    }));
};
var getDomain = function (url) {
    return url
        .split("/")
        .filter(function (s, i) { return i > 1 && i < 3; })
        .join("/");
};
var domainList = [
    "m.shopping.naver.com",
    "m.shop.interpark.com",
    "www.lotteon.com",
    "m.tmon.co.kr",
    "m.smartstore.naver.com",
    "m.coupang.com",
    "m.11st.co.kr",
    "m.day-r.com",
    "m.hnsmall.com",
    "mitem.gmarket.co.kr",
    "mitem.auction.co.kr",
    "m.pickatdoor.io",
    "www.vimeal.co.kr",
    "mw.wemakeprice.com",
    "www.yaksamom.com",
];
var getProductPrice = function ($, domain) {
    var regex = /[^0-9]/g;
    var priceDiv = null;
    var priceRaw = null;
    switch (domain) {
        case "m.11st.co.kr":
            priceDiv = $("#priceLayer > div > span > b");
            break;
        case "m.shopping.naver.com":
            priceDiv = $("#content > div > div > fieldset > div > div > div > strong > span");
            break;
        case "m.shop.interpark.com":
            priceDiv = $("#productsContainer > div.productsContents > div.productSummary > div.priceWrap > div.price > div.priceCol > dl > dd.discountedPrice > span.numeric");
            break;
        case "www.lotteon.com":
            priceDiv = $("input#metaData");
            priceRaw = JSON.parse(priceDiv.attr("value")).product.priceInfo.slPrc;
            break;
        case "m.tmon.co.kr":
            priceDiv = $("#view-default-scene-default > div.deal_info > article.deal_info_summary > div.deal_price > p.deal_price_sell > strong");
            break;
        // case "m.hnsmall.com":
        //   priceDiv = $(`div.goods-benefit-box > div:nth-child(2) > dl > dd > strong`);
        //   console.log(priceDiv.text() + "asd");
        //   break;
        case "mitem.auction.co.kr":
            priceDiv = $("#DetailTab > article > div.vip_top > div.vip_top__info > div.vip_top__pricearea.vip_delivery-noti > div.vip_top__price > div > strong");
            console.log(priceDiv.text() + "asd");
            break;
        default:
            break;
    }
    return priceRaw ? priceRaw : Number(priceDiv ? priceDiv.text().replace(regex, "") : 0);
};
var getProduct = function (productId, url, domain) {
    return new Promise(function (resolve) {
        (0, request_1.default)(url, 
        // {
        //   headers: {
        //     "accept-encoding": "deflate, br",
        //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        //     "cache-control": "max-age=0",
        //     dnt: 1,
        //     "sec-ch-ua-platform": "Mac",
        //     "sec-fetch-dest": "document",
        //     "user-agent": "PostmanRuntime/7.29.2",
        //     Accept: "*/*",
        //     Connection: "keep-alive",
        //     "User-Agent":
        //       "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
        //   },
        // },
        function (error, response, body) { return __awaiter(void 0, void 0, void 0, function () {
            var $, result;
            return __generator(this, function (_a) {
                if (error)
                    throw error;
                $ = cheerio_1.default.load(body);
                try {
                    result = getProductPrice($, domain);
                    if (!result)
                        console.log("  No Price", result, domain, url);
                    //  #content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)
                    //판매처 쇼핑몰 이름
                    // const store_name = await getProductStoreName(brandUrl);
                    // // 판매처 제품가격
                    // const regex = /[^0-9]/g;
                    // let product_price = Number(
                    //   $(
                    //     "#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)"
                    //   )
                    //     .text()
                    //     .replace(regex, "")
                    // );
                    // // 판매처 배송비
                    // let product_delivery = Number(
                    //   $("#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div > div > span:nth-child(2)")
                    //     .text()
                    //     .replace(regex, "")
                    // );
                    // log("id:", productId, "store:", store_name, "price", product_price, "delivery:", product_delivery);
                    // // 쿼리 작성
                    // writeQuery(
                    //   insertForm({
                    //     product_id: productId,
                    //     product_price,
                    //     product_link: brandUrl,
                    //     product_delivery,
                    //     store_name,
                    //   })
                    // );
                }
                catch (error) {
                    console.error("Err::", error);
                }
                return [2 /*return*/];
            });
        }); });
    });
};
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
    var _b = _a.product_id, product_id = _b === void 0 ? 1 : _b, _c = _a.product_price, product_price = _c === void 0 ? null : _c, _d = _a.product_link, product_link = _d === void 0 ? null : _d, _e = _a.product_delivery, product_delivery = _e === void 0 ? null : _e, _f = _a.store_name, store_name = _f === void 0 ? null : _f;
    return "INSERT INTO F_DAYWORKS.product_low_price_data (product_id, product_price, product_link, product_delivery, store_name) VALUES (".concat(product_id, ", ").concat(ifNull(product_price), ", ").concat(ifNull(product_link), ", ").concat(ifNull(product_delivery), ", ").concat(ifNull(store_name), ") ON DUPLICATE KEY UPDATE product_price = ").concat(ifNull(product_price), ", product_link = ").concat(ifNull(product_link), ", product_delivery = ").concat(ifNull(product_delivery), ", store_name = ").concat(ifNull(store_name), ";\n  ");
};
//#endregion
// 제외리스트
var exceptList = [];
// 찾을 리스트
var productList = [
    [
        70,
        [
            "http://mitem.auction.co.kr/vip?itemNo=C521322391",
            // "http://mitem.gmarket.co.kr/Item?goodsCode=1811333817&jaehuid=200006220",
        ],
    ],
];
var wrapSlept = function (sec) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, sec); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var f = function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, item, productId, otherShopUrlList, j, url, domain;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < productList.length)) return [3 /*break*/, 7];
                item = productList[i];
                productId = item[0], otherShopUrlList = item[1];
                if (!!exceptList.includes(productId)) return [3 /*break*/, 6];
                j = 0;
                _a.label = 2;
            case 2:
                if (!(j < otherShopUrlList.length)) return [3 /*break*/, 6];
                url = otherShopUrlList[j];
                domain = getDomain(url);
                if (!!domainList.includes(domain)) return [3 /*break*/, 3];
                log("Err: can't get domain", domain);
                return [3 /*break*/, 5];
            case 3:
                getProduct(productId, otherShopUrlList[j], domain);
                return [4 /*yield*/, wrapSlept(500)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                j++;
                return [3 /*break*/, 2];
            case 6:
                i++;
                return [3 /*break*/, 1];
            case 7:
                console.log("Done!");
                return [2 /*return*/];
        }
    });
}); };
f();
