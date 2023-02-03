"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationKey = void 0;
var AuthorizationKey = function () {
    var time = String(new Date().getTime());
    return "dirldirlvkdlxld4".concat(time).concat(time
        .split("")
        .map(Number)
        .reduce(function (n, p) { return n + p; }, 0)
        .toString()
        .padStart(3, "0"));
};
exports.AuthorizationKey = AuthorizationKey;
