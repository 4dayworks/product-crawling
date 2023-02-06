import { updateByItemscout } from "./function/updateByItemscout";
import { AuthorizationKey } from "./function/auth";
import axios from "axios";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

updateByItemscout(100000, 0, true);

// yarn update:naver 네이버카테고리, yarn update:itemscout_is_expert 약사님 있는거는 매일
// yarn update:itemscout_no_expert  약사님 리뷰 없으면 일주일에 한번 월요일 00시에 반복
