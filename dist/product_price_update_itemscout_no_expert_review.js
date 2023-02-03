"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var updateByItemscout_1 = require("./function/updateByItemscout");
var auth_1 = require("./function/auth");
var axios_1 = __importDefault(require("axios"));
axios_1.default.defaults.headers.common["Authorization"] = "Bearer ".concat((0, auth_1.AuthorizationKey)());
(0, updateByItemscout_1.updateByItemscout)(40000, 0, false);
//[O] 약국제품은 is_manual=1로 고정 가격 안불러오기 / 아이템스카우트 / 네이버
// 약사님 있는거는 매일
// 약사님 리뷰 없으면 일주일에 한번 월요일 00시에 반복
// 40개 묶어서 insert하기
