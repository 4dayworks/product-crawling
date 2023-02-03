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
var getProduct = function (productId, catalogUrl) {
    return new Promise(function (resolve) {
        (0, request_1.default)(catalogUrl, {
            headers: {
            //     "accept-encoding": "deflate, br",
            //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
            //     "cache-control": "max-age=0",
            //     dnt: 1,
            //     "sec-ch-ua-platform": "Mac",
            //     "sec-fetch-dest": "document",
            //     "user-agent": "PostmanRuntime/7.29.2",
            //     Accept: "*/*",
            //     Connection: "keep-alive",
            // "sec-ch-ua-platform": "Android",
            // "User-Agent":
            //   "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36",
            },
        }, function (error, response, body) {
            if (error)
                throw error;
            var $ = cheerio_1.default.load(body);
            try {
                // #section-price > ul > li:nth-child(1) > div > div > div > span > span
                // const product_item1 = $(
                //   "#section-price > ul > li:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)"
                // ).text();
                var storeList_1 = [];
                // storeList 가져오기
                $("#section-price > ul > li").each(function (i, item) {
                    // 판매처이름
                    var store_name = $("#section-price > ul > li:nth-child(".concat(i + 1, ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(1) > span:nth-child(1)")).text();
                    // 판매처 제품가격
                    var regex = /[^0-9]/g;
                    var product_price = Number($("#section-price > ul > li:nth-child(".concat(i + 1, ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)  > span:nth-child(2) > span:nth-child(1)"))
                        .text()
                        .replace(regex, ""));
                    product_price = product_price ? product_price : 0;
                    //판매처 배송비
                    var product_delivery = Number($("#section-price > ul > li:nth-child(".concat(i + 1, ") > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)  > div:nth-child(2) > span:nth-child(1)"))
                        .text()
                        .replace(regex, ""));
                    product_price = product_price ? product_price : 0;
                    // 판매처링크
                    var product_link = $("#section-price > ul > li:nth-child(".concat(i + 1, ") > div:nth-child(1) > a")).attr("href");
                    storeList_1.push({
                        product_id: productId,
                        store_name: store_name,
                        product_link: product_link,
                        product_price: product_price,
                        product_delivery: product_delivery,
                    });
                    log("id:", productId, "store:", store_name, "store_index:", i, "price", product_price, "delivery:", product_delivery);
                });
                // 최저가 가져오기
                var cheapStore = {
                    price: null,
                    index: null,
                    data: null,
                };
                for (var index = 0; index < storeList_1.length; index++) {
                    var data = storeList_1[index];
                    var price = data.product_price ? data.product_price : 0;
                    if (cheapStore.index === null)
                        cheapStore = { price: price, index: index, data: data };
                    else if (cheapStore.price != null && cheapStore.price > price)
                        cheapStore = { price: price, index: index, data: data };
                }
                // 쿼리 작성
                if (cheapStore.data)
                    writeQuery(insertForm(cheapStore.data));
            }
            catch (error) {
                console.error(error);
            }
        });
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
    return "INSERT INTO F_DAYWORKS.product_low_price_data (product_id, product_price, product_link, product_delivery, store_name) VALUES (".concat(product_id, ", ").concat(ifNull(product_price), ", ").concat(ifNull(product_link), ", ").concat(ifNull(product_delivery), ", ").concat(ifNull(store_name), ") ON DUPLICATE KEY UPDATE product_price = ").concat(ifNull(product_price), ", product_link = ").concat(ifNull(product_link), ", product_delivery = ").concat(ifNull(product_delivery), ", store_name = ").concat(ifNull(store_name), ";");
};
//#endregion
// 제외리스트
var exceptList = [];
// 찾을 리스트
var productList = [
    [143, "https://msearch.shopping.naver.com/catalog/13023045079"],
    [28635, "https://msearch.shopping.naver.com/catalog/14237260695"],
    [34080, "https://msearch.shopping.naver.com/catalog/14483789464"],
    [27586, "https://msearch.shopping.naver.com/catalog/19699274631"],
    [34106, "https://msearch.shopping.naver.com/catalog/14911269432"],
    [10185, "https://msearch.shopping.naver.com/catalog/15311364784"],
    [2005, "https://msearch.shopping.naver.com/catalog/15982540239"],
    [27855, "https://msearch.shopping.naver.com/catalog/16088309396"],
    [90, "https://msearch.shopping.naver.com/catalog/16216655666"],
    [34224, "https://msearch.shopping.naver.com/catalog/16464058650"],
    [46, "https://msearch.shopping.naver.com/catalog/16646261597"],
    [206, "https://msearch.shopping.naver.com/catalog/17436439198"],
    [34107, "https://msearch.shopping.naver.com/catalog/17557536478"],
    [35, "https://msearch.shopping.naver.com/catalog/17840053533"],
    [23584, "https://msearch.shopping.naver.com/catalog/17877514162"],
    [202, "https://msearch.shopping.naver.com/catalog/17894908932"],
    [182, "https://msearch.shopping.naver.com/catalog/18149741781"],
    [123, "https://msearch.shopping.naver.com/catalog/18165832705"],
    [151, "https://msearch.shopping.naver.com/catalog/18343162898"],
    [132, "https://msearch.shopping.naver.com/catalog/18573834543"],
    [6733, "https://msearch.shopping.naver.com/catalog/18732148567"],
    [1, "https://msearch.shopping.naver.com/catalog/18732353565"],
    [7332, "https://msearch.shopping.naver.com/catalog/18757916176"],
    [34111, "https://msearch.shopping.naver.com/catalog/18793254806"],
    [5334, "https://msearch.shopping.naver.com/catalog/18882046600"],
    [25, "https://msearch.shopping.naver.com/catalog/19250492248"],
    [65, "https://msearch.shopping.naver.com/catalog/19250750950"],
    [43246, "https://msearch.shopping.naver.com/catalog/19254398622"],
    [13504, "https://msearch.shopping.naver.com/catalog/19254654640"],
    [32183, "https://msearch.shopping.naver.com/catalog/19301686546"],
    [19649, "https://msearch.shopping.naver.com/catalog/19378215038"],
    [83, "https://msearch.shopping.naver.com/catalog/19390989550"],
    [234, "https://msearch.shopping.naver.com/catalog/19391093907"],
    [21078, "https://msearch.shopping.naver.com/catalog/19391305490"],
    [17094, "https://msearch.shopping.naver.com/catalog/19489720077"],
    [17343, "https://msearch.shopping.naver.com/catalog/19490915884"],
    [88, "https://msearch.shopping.naver.com/catalog/19536779515"],
    [14, "https://msearch.shopping.naver.com/catalog/20022577538"],
    [295, "https://msearch.shopping.naver.com/catalog/20023283588"],
    [18205, "https://msearch.shopping.naver.com/catalog/20052562892"],
    [19023, "https://msearch.shopping.naver.com/catalog/20158664406"],
    [19024, "https://msearch.shopping.naver.com/catalog/20158751704"],
    [159, "https://msearch.shopping.naver.com/catalog/20514608589"],
    [36393, "https://msearch.shopping.naver.com/catalog/20828963538"],
    [16261, "https://msearch.shopping.naver.com/catalog/20907067796"],
    [738, "https://msearch.shopping.naver.com/catalog/20932299577"],
    [356, "https://msearch.shopping.naver.com/catalog/20943064230"],
    [180, "https://msearch.shopping.naver.com/catalog/21124566060"],
    [24104, "https://msearch.shopping.naver.com/catalog/21124597532"],
    [17111, "https://msearch.shopping.naver.com/catalog/21124598188"],
    [756, "https://msearch.shopping.naver.com/catalog/21126199670"],
    [25180, "https://msearch.shopping.naver.com/catalog/21126215206"],
    [24452, "https://msearch.shopping.naver.com/catalog/21126215208"],
    [24528, "https://msearch.shopping.naver.com/catalog/21285939601"],
    [156, "https://msearch.shopping.naver.com/catalog/21354725259"],
    [4848, "https://msearch.shopping.naver.com/catalog/21395373735"],
    [78, "https://msearch.shopping.naver.com/catalog/21445263832"],
    [461, "https://msearch.shopping.naver.com/catalog/21480099604"],
    [28, "https://msearch.shopping.naver.com/catalog/21630162350"],
    [38503, "https://msearch.shopping.naver.com/catalog/21893003853"],
    [6797, "https://msearch.shopping.naver.com/catalog/22005574993"],
    [8309, "https://msearch.shopping.naver.com/catalog/22006046023"],
    [27337, "https://msearch.shopping.naver.com/catalog/22057749507"],
    [122, "https://msearch.shopping.naver.com/catalog/22103121641"],
    [135, "https://msearch.shopping.naver.com/catalog/22103121641"],
    [27735, "https://msearch.shopping.naver.com/catalog/22345882746"],
    [24907, "https://msearch.shopping.naver.com/catalog/22347198113"],
    [175, "https://msearch.shopping.naver.com/catalog/22399385519"],
    [56, "https://msearch.shopping.naver.com/catalog/22469972579"],
    [280, "https://msearch.shopping.naver.com/catalog/22664903844"],
    [42935, "https://msearch.shopping.naver.com/catalog/22908197426"],
    [89, "https://msearch.shopping.naver.com/catalog/23603349490"],
    [29, "https://msearch.shopping.naver.com/catalog/23605831493"],
    [34086, "https://msearch.shopping.naver.com/catalog/23836740522"],
    [19806, "https://msearch.shopping.naver.com/catalog/24109096524"],
    [12601, "https://msearch.shopping.naver.com/catalog/24301216524"],
    [13651, "https://msearch.shopping.naver.com/catalog/24380672524"],
    [34, "https://msearch.shopping.naver.com/catalog/24386569522"],
    [15895, "https://msearch.shopping.naver.com/catalog/24594037522"],
    [35362, "https://msearch.shopping.naver.com/catalog/24702006863"],
    [7186, "https://msearch.shopping.naver.com/catalog/25153051522"],
    [106, "https://msearch.shopping.naver.com/catalog/25153950522"],
    [34090, "https://msearch.shopping.naver.com/catalog/25322332529"],
    [204, "https://msearch.shopping.naver.com/catalog/25397419527"],
    [71, "https://msearch.shopping.naver.com/catalog/25414366522"],
    [11416, "https://msearch.shopping.naver.com/catalog/25525131522"],
    [9071, "https://msearch.shopping.naver.com/catalog/26008180522"],
    [34067, "https://msearch.shopping.naver.com/catalog/26558797524"],
    [167, "https://msearch.shopping.naver.com/catalog/26558831522"],
    [387, "https://msearch.shopping.naver.com/catalog/27518193525"],
    [107, "https://msearch.shopping.naver.com/catalog/27582048524"],
    [66, "https://msearch.shopping.naver.com/catalog/27669200522"],
    [283, "https://msearch.shopping.naver.com/catalog/27682304523"],
    [1086, "https://msearch.shopping.naver.com/catalog/27697229522"],
    [9688, "https://msearch.shopping.naver.com/catalog/28388138554"],
    [55, "https://msearch.shopping.naver.com/catalog/28421288555"],
    [9631, "https://msearch.shopping.naver.com/catalog/28586609557"],
    [34109, "https://msearch.shopping.naver.com/catalog/28653191554"],
    [9703, "https://msearch.shopping.naver.com/catalog/28776369554"],
    [43209, "https://msearch.shopping.naver.com/catalog/28790191556"],
    [87, "https://msearch.shopping.naver.com/catalog/29016575586"],
    [533, "https://msearch.shopping.naver.com/catalog/29227342619"],
    [91, "https://msearch.shopping.naver.com/catalog/29425743618"],
    [63, "https://msearch.shopping.naver.com/catalog/29725407621"],
    [641, "https://msearch.shopping.naver.com/catalog/30175691622"],
    [639, "https://msearch.shopping.naver.com/catalog/30500930618"],
    [5279, "https://msearch.shopping.naver.com/catalog/30976285618"],
    [38004, "https://msearch.shopping.naver.com/catalog/30992214621"],
    [10917, "https://msearch.shopping.naver.com/catalog/31333163624"],
    [37372, "https://msearch.shopping.naver.com/catalog/31841762624"],
    [7053, "https://msearch.shopping.naver.com/catalog/31890526619"],
    [19657, "https://msearch.shopping.naver.com/catalog/31905693621"],
    [723, "https://msearch.shopping.naver.com/catalog/32461056618"],
    [7959, "https://msearch.shopping.naver.com/catalog/32558989623"],
    [2604, "https://msearch.shopping.naver.com/catalog/32938517618"],
    [501, "https://msearch.shopping.naver.com/catalog/33039885618"],
    [1991, "https://msearch.shopping.naver.com/catalog/33057321618"],
    [5144, "https://msearch.shopping.naver.com/catalog/33194965620"],
    [2364, "https://msearch.shopping.naver.com/catalog/33212403618"],
    [900, "https://msearch.shopping.naver.com/catalog/33622235618"],
    [6124, "https://msearch.shopping.naver.com/catalog/33737483619"],
    [4701, "https://msearch.shopping.naver.com/catalog/33858843618"],
    [2952, "https://msearch.shopping.naver.com/catalog/34541513618"],
    [8184, "https://msearch.shopping.naver.com/catalog/34939662619"],
    [8692, "https://msearch.shopping.naver.com/catalog/35059874623"],
    [12585, "https://msearch.shopping.naver.com/catalog/5894138486"],
    [31188, "https://msearch.shopping.naver.com/catalog/5944644989"],
    [37, "https://msearch.shopping.naver.com/catalog/6663522597"],
    [11, "https://msearch.shopping.naver.com/catalog/6743170459"],
];
var wrapSlept = function (sec) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, sec); })];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var f = function () { return __awaiter(void 0, void 0, void 0, function () {
    var i, item, productId, catalogUrl;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!(i < productList.length)) return [3 /*break*/, 4];
                item = productList[i];
                productId = item[0], catalogUrl = item[1];
                if (!!exceptList.includes(productId)) return [3 /*break*/, 3];
                getProduct(productId, catalogUrl);
                return [4 /*yield*/, wrapSlept(3000)];
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
