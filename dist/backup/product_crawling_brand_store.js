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
var log = console.log;
var getProductStoreName = function (brandUrl) {
    return new Promise(function (resolve, reject) {
        var mainUrl = brandUrl
            .split("/")
            .filter(function (s, i) { return i < 4; })
            .join("/");
        (0, request_1.default)(mainUrl, {}, function (error, response, body) {
            var $ = cheerio_1.default.load(body);
            resolve($("title").text());
        });
    });
};
var getProduct = function (productId, brandUrl) {
    return new Promise(function (resolve) {
        (0, request_1.default)(brandUrl, {}, function (error, response, body) { return __awaiter(void 0, void 0, void 0, function () {
            var $, store_name, regex, product_price, product_delivery, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (error)
                            throw error;
                        $ = cheerio_1.default.load(body);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getProductStoreName(brandUrl)];
                    case 2:
                        store_name = _a.sent();
                        regex = /[^0-9]/g;
                        product_price = Number($("#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div:nth-child(2) > div:nth-child(2) > div > strong > span:nth-child(2)")
                            .text()
                            .replace(regex, ""));
                        product_delivery = Number($("#content > div > div:nth-child(2) > div:nth-child(2) > fieldset > div > div > span:nth-child(2)")
                            .text()
                            .replace(regex, ""));
                        log("id:", productId, "store:", store_name, "price", product_price, "delivery:", product_delivery);
                        // 쿼리 작성
                        writeQuery(insertForm({
                            product_id: productId,
                            product_price: product_price,
                            product_link: brandUrl,
                            product_delivery: product_delivery,
                            store_name: store_name,
                        }));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
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
        60,
        "https://m.brand.naver.com/nutricore/products/4334691656?NaPm=ct%3Dldbnmjco%7Cci%3D0yK0000V8X5xjpD3CvpW%7Ctr%3Dpla%7Chk%3D1ad0ddf251016609aaff46484c64e37a0769e85a",
    ],
    [
        5424,
        "https://m.brand.naver.com/yuhan/products/6420158197?NaPm=ct%3Dldbnt3go%7Cci%3D54dc2648533138b520cfae83c669d55b8603b3be%7Ctr%3Dslsf%7Csn%3D2221700%7Chk%3Dae4d5e92ede797810110dc8f57905189bb6b052b",
    ],
    [
        70,
        "https://m.brand.naver.com/yuhan/products/6740016071?NaPm=ct%3Dldbm4v94%7Cci%3D7bdbae90b48a442dede3d88cd92d1bce52766657%7Ctr%3Dslsf%7Csn%3D2221700%7Chk%3D8a8d3ced1b8bdb40cbd62f00c23bceef8eeb5e26",
    ],
];
var wrapSlept = function (sec) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, sec); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var f = function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, item, productId, brandUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < productList.length)) return [3 /*break*/, 4];
                item = productList[i];
                productId = item[0], brandUrl = item[1];
                if (!!exceptList.includes(productId)) return [3 /*break*/, 3];
                getProduct(productId, brandUrl);
                return [4 /*yield*/, wrapSlept(5000)];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                i++;
                return [3 /*break*/, 1];
            case 4:
                console.log("Done!");
                return [2 /*return*/];
        }
    });
}); };
f();
