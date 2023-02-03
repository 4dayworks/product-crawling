"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifNull = void 0;
var ifNull = function (str) {
    return str ? "'".concat(String(str).replace(/'/gi, "\\'").replace(/"/gi, '\\"'), "'") : "null";
};
exports.ifNull = ifNull;
