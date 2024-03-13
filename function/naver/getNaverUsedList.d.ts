export type SaveNaverUsedType = {
  camp_keyword: string;
  product_id: number;
  store_link: string;
  store_image: string;
  store_name: string;
  product_name: string;
  price: number;
  cafe_id: number;
  article_id: number;
  menu_id: number;
  cafe_url: string;
  member_key: string;
  author_nick_name: string;
  cafe_name: string;
  cafe_thumbnail_image_url: string;
  subject: string;
  content: string;
  sc: string;
  art: string;
  escrow: 0 | 1;
  sale_status: string;
  product_condition: string;
  category1_id: string;
  category2_id: string;
  category3_id: string;
  category1_name: string;
  category2_name: string;
  category3_name: string;
  region_list: object;
  delivery_type_list: string;
  power_cafe: 0 | 1;
  town_cafe: 0 | 1;
  attach_image_count: number;
  write_at: string;
  write_time: number;
};
export type NaverDataType = {
  result: {
    totalCount: number; //75793;
    articleCount: number; //10;
    start: number; //1;
    query: string; //"중고거래";
    adult: boolean; //false;
    highlightOff: boolean; //false;
    rcodeList: any[];
    selectedRegion: any[];
    tradeArticleList: {
      type: string; //"ARTICLE";
      item: {
        cafeId: number; //10050146;
        articleId: number; //1045274563;
        menuId: number; //2105;
        cafeUrl: string; //"joonggonara";
        memberKey: string; //"gnExgJgoDyV8usH9uXGWYw";
        authorNickName: string; //"캐리어마켓";
        cafeName: string; //"중고나라";
        cafeThumbnailImageUrl: string; //"https://cafeptthumb-phinf.pstatic.net/MjAyMzA1MjVfMTkx/MDAxNjg0OTgzNzM0MDk3.1vPCs_txao5shn_eFMSdr1XkuJmADmQ--qAqAzAycscg.HnwLC_x51hL6Lh0YijcpFGCZozS9fcgLRvwpVm6B_8Yg.PNG/Icon-58X583x.png";
        subject: string; //"루프탑텐트/일체형루프박스 중고거래 이전설치 캐리어마켓 경기도 의정부점";
        content: string; //"안녕하세요 차량용 캠핑장비 전문점 캐리어마켓 입니다. 중고거래간에 탈착에 어려움을 격으실 수 있으실텐데 본 매장에서 전문가에게 저렴한 가격에 이전장착 받아보세요 ! 매장위치 : 경기도 의정부시 송산로 939번길 80 나동 캐리어마켓 010-5097-2688 거래간에 필요한 국산 유일캐리어 가로바까지 차종별로 판매하고 있사오니 많은 문의 주세요";
        thumbnailImageUrl: string; //"https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMDhfMzEg/MDAxNzA5ODc2MTc5MTAw.BiLmP6c5KFc6xKLvouoKt_jqQYnPDMbfGMqrn9SmkrQg.iAFz43xNZrHRleL5dByTMEkiyW73Qsh5uUL1kTQWFnAg.PNG/이전설치.png";
        sc: string; //"aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjEwNDUyNzQ1NjMsImlzc3VlZEF0IjoxNzEwMzA3Mzk1MTU3LCJjYWZlSWQiOjEwMDUwMTQ2fQ.s8rivu6PHmzL4IvURXGCdV_pAzq8nC-e5K5h3nX7HZc";
        art: string; //"aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjEwNDUyNzQ1NjMsImlzc3VlZEF0IjoxNzEwMzA3Mzk1MTU3LCJjYWZlSWQiOjEwMDUwMTQ2fQ.s8rivu6PHmzL4IvURXGCdV_pAzq8nC-e5K5h3nX7HZc";
        productSale: {
          productName: string; //"루프탑텐트/일체형루프박스 중고거래 이전설치 캐리어마켓 경기도 의정부점";
          escrow: boolean; //true; 안전거래 여부
          saleStatus: string; //"ON_SALE"; //판매중 여부
          cost: number; // 110000;
          productCondition: "NEW" | "ALMOST_NEW"; // 완전새거 or 거의새거 여부
          tradeCategory: {
            category1Id: string; //"50000007";
            category2Id: string; //"50000028";
            category3Id: string; //"50001304";
            category1Name: string; //"스포츠,레저";
            category2Name: string; //"캠핑";
            category3Name: string; //"기타캠핑용품";
          };
          regionList: {
            regionCode1: string; //"02";
            regionCode2: string; //"02150";
            regionCode3: string; //"02150113";
            regionName1: string; //"경기도";
            regionName2: string; //"의정부시";
            regionName3: string; //"산곡동";
          }[];
          deliveryTypeList: ("ONLINE" | "DELIVERY" | "MEET")[]; //온라인전송, 택배거래, 직거래
        };
        powerCafe: boolean; //true; 대표카페 여부
        townCafe: false;
        attachImageCount: number; //2; 붙은 이미지 갯수
        writeTime: number; //1710302941000;
      };
    }[];
    recommendCategoryList: {
      categoryId: string; //"50000028",
      categoryName: string; //"캠핑",
      productCount: number; //70073
    }[];
    recommendKeywordList: string[];
    // recommendKeywordListExample :
    // ["중고거래 사이트",
    // "중고거래 사기",
    // "중고거래 사기 신고",
    // "중고거래 환불",
    // "네이버 중고거래",
    // "오토바이 중고거래",
    // "중고거래 사기 조회",
    // "카페 중고거래",
    // "아이패드 중고거래",
    // "당근마켓 중고거래",
    // "토스 중고거래 사기",
    // "중고거래 사기 합의금",
    // "중고거래 영화",
    // "애플워치 중고거래",
    // "자전거 중고거래",
    // "오토바이 중고거래 서류",
    // "바이크 중고거래",
    // "중고거래 신고",
    // "중고거래 앱",
    // "렌즈 중고거래"]
    searchedCategory: {
      category: {
        categoryId: string; //"50000007";
        parentCategoryId: string; //"";
        categoryName: string; //"스포츠/레저";
        categoryLevel: number; //1;
        lastLevel: boolean; //false;
        exposureOrder: number; //8;
        fullPathLabel: string; //"스포츠/레저";
        categoryLevel3: boolean; //false;
        categoryLevel2: boolean; //false;
      };
    };
    responseModelVersion: string; //"V4";
  };
};

//#region tradeArticleList Example
//  {
//         type: "ARTICLE";
//         item: {
//           cafeId: 10050146;
//           articleId: 1045274563;
//           menuId: 2105;
//           cafeUrl: "joonggonara";
//           memberKey: "gnExgJgoDyV8usH9uXGWYw";
//           authorNickName: "캐리어마켓";
//           cafeName: "중고나라";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMzA1MjVfMTkx/MDAxNjg0OTgzNzM0MDk3.1vPCs_txao5shn_eFMSdr1XkuJmADmQ--qAqAzAycscg.HnwLC_x51hL6Lh0YijcpFGCZozS9fcgLRvwpVm6B_8Yg.PNG/Icon-58X583x.png";
//           subject: "루프탑텐트/일체형루프박스 중고거래 이전설치 캐리어마켓 경기도 의정부점";
//           content: "안녕하세요 차량용 캠핑장비 전문점 캐리어마켓 입니다. 중고거래간에 탈착에 어려움을 격으실 수 있으실텐데 본 매장에서 전문가에게 저렴한 가격에 이전장착 받아보세요 ! 매장위치 : 경기도 의정부시 송산로 939번길 80 나동 캐리어마켓 010-5097-2688 거래간에 필요한 국산 유일캐리어 가로바까지 차종별로 판매하고 있사오니 많은 문의 주세요";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMDhfMzEg/MDAxNzA5ODc2MTc5MTAw.BiLmP6c5KFc6xKLvouoKt_jqQYnPDMbfGMqrn9SmkrQg.iAFz43xNZrHRleL5dByTMEkiyW73Qsh5uUL1kTQWFnAg.PNG/이전설치.png";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjEwNDUyNzQ1NjMsImlzc3VlZEF0IjoxNzEwMzA3Mzk1MTU3LCJjYWZlSWQiOjEwMDUwMTQ2fQ.s8rivu6PHmzL4IvURXGCdV_pAzq8nC-e5K5h3nX7HZc";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjEwNDUyNzQ1NjMsImlzc3VlZEF0IjoxNzEwMzA3Mzk1MTU3LCJjYWZlSWQiOjEwMDUwMTQ2fQ.s8rivu6PHmzL4IvURXGCdV_pAzq8nC-e5K5h3nX7HZc";
//           productSale: {
//             productName: "루프탑텐트/일체형루프박스 중고거래 이전설치 캐리어마켓 경기도 의정부점";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 110000;
//             productCondition: "NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "02";
//                 regionCode2: "02150";
//                 regionCode3: "02150113";
//                 regionName1: "경기도";
//                 regionName2: "의정부시";
//                 regionName3: "산곡동";
//               }
//             ];
//             deliveryTypeList: ["DELIVERY", "MEET"];
//           };
//           powerCafe: true;
//           townCafe: false;
//           attachImageCount: 2;
//           writeTime: 1710302941000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 31078863;
//           articleId: 942716;
//           menuId: 12;
//           cafeUrl: "onecarchunggocha";
//           memberKey: "-kGWpxBUCTcX5LRCB1-NuA";
//           authorNickName: "첫차46";
//           cafeName: "★첫차중고차★허위없는 실매물 중고차★";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAyMjdfMTIg/MDAxNzA5MDE2MTczMzY0.qej48RmO2S9illGcamlyMKnAct7JjcoDUp63ETyTjEgg.Z-R7yob-tr1-1CBnWK_1ji8yZHknNd6_13XtXMK7elIg.PNG/K-235.png";
//           subject: "스타렉스 중고 2017년식 78,946km 11인승 왜건 4WD 모던 스페셜 중고차거래사이트";
//           content: "스타렉스 중고 2017년식 78,946km 11인승 왜건 4WD 모던 스페셜 중고차거래사이트 차 명 : 그랜드 스타렉스 11인승 왜건 4WD 모던 스페셜 제 조 사 : 현대 연 식 : 2017 (2017.05) 주행거리 : 78,946km 차량가격 : 1,860만원 (84개월 할부시 220,000원) 색 상 : 회색 연 료 : 경유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : ECM룸미러,네비게이션,4륜구동 기타사항 : 무사고 정품네비 후방카메라 이모빌 하이페스룸미러 통풍시트 문의전화 : 010-5847-9975";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfMjEz/MDAxNzEwMzAxMzI4ODE1.ev28IAQAwHI0J8Y4DF-jben6rGkeYiiUphnKSq4sLxMg.yVn7CvpbZ07mcSX0Zqyu0dTSK1skRcTIqBMOhS4diTgg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MjcxNiwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTcsImNhZmVJZCI6MzEwNzg4NjN9.7pCAqvTfctTsxZxlA4PqINZlLZ3wCE1XfcpMwhWabKA";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MjcxNiwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTcsImNhZmVJZCI6MzEwNzg4NjN9.7pCAqvTfctTsxZxlA4PqINZlLZ3wCE1XfcpMwhWabKA";
//           productSale: {
//             productName: "스타렉스 중고 2017년식 78,946km 11인승 왜건 4WD 모던 스페셜 중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 18600000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "09";
//                 regionCode2: "09320";
//                 regionCode3: "09320105";
//                 regionName1: "서울특별시";
//                 regionName2: "도봉구";
//                 regionName3: "쌍문동";
//               },
//               {
//                 regionCode1: "09";
//                 regionCode2: "09320";
//                 regionCode3: "09320106";
//                 regionName1: "서울특별시";
//                 regionName2: "도봉구";
//                 regionName3: "방학동";
//               },
//               {
//                 regionCode1: "09";
//                 regionCode2: "09320";
//                 regionCode3: "09320108";
//                 regionName1: "서울특별시";
//                 regionName2: "도봉구";
//                 regionName3: "도봉동";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 25;
//           writeTime: 1710301528000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 31078865;
//           articleId: 941504;
//           menuId: 12;
//           cafeUrl: "chunggonarachachacha";
//           memberKey: "r_O5ocY4iuFFRR-xLI6TIA";
//           authorNickName: "중고차매니저15";
//           cafeName: "★중고차나라 ★허위없는실매물중고차★";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAyMjdfODAg/MDAxNzA5MDI2Nzc1NjUy.sMeCHV8h1MBkK6z2oiEAcxNIAlDhP50p1uDA85rDcf0g.8fgrtoylLPGbwKtcXY8VIPzW1ajZvggwB0WnMduwfuog.PNG/K-245.png";
//           subject: "스타렉스 중고 2019년식 2WD 밴 3인승 스타일 중고차거래사이트";
//           content: "스타렉스 중고 2019년식 2WD 밴 3인승 스타일 중고차거래사이트 차 명 : 더 뉴 그랜드 스타렉스 2WD 밴 3인승 스타일 제 조 사 : 현대 연 식 : 2019 (2019.08) 주행거리 : 98,315km 차량가격 : 1,550만원 (84개월 할부시 180,000원) 색 상 : 흰색 연 료 : 경유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 에어컨,썬팅,전동접이식백미러,오토도어록,도난경보기,가죽시트,네비게이션,블랙박스,AV시스템,슈퍼비젼계기판,감지센서 후방,TPMS 타이어 공기압센서,자동도어잠금,파워도어록,전동사이드미러,ABS 브레이크 잠김 방지,에어백 운전석,에어백 조수석 기타사항 : 경정비완료 순정네비후카관리최상 문의전화 : 010-5471-9955";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfNjcg/MDAxNzEwMjk3ODk3Mjgx.8yb9ScBMp8Z8c23dnGxUrOwoJ3dYJ4rqxqvvg4FaaXcg.DzTpwJ0PctsKHDOOGKHTlfWJ8AcNM3ApdZVKPQBh2-Eg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MTUwNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzg4NjV9.MIcEja2mMdCQ7VEY-QO5SNDl3G7eiWE2T0lnnFYKT5g";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MTUwNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzg4NjV9.MIcEja2mMdCQ7VEY-QO5SNDl3G7eiWE2T0lnnFYKT5g";
//           productSale: {
//             productName: "스타렉스 중고 2019년식 2WD 밴 3인승 스타일 중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 15500000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "02";
//                 regionCode2: "02820";
//                 regionCode3: "02820310";
//                 regionName1: "경기도";
//                 regionName2: "가평군";
//                 regionName3: "설악면";
//               },
//               {
//                 regionCode1: "02";
//                 regionCode2: "02820";
//                 regionCode3: "02820330";
//                 regionName1: "경기도";
//                 regionName2: "가평군";
//                 regionName3: "상면";
//               },
//               {
//                 regionCode1: "02";
//                 regionCode2: "02820";
//                 regionCode3: "02820350";
//                 regionName1: "경기도";
//                 regionName2: "가평군";
//                 regionName3: "북면";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 26;
//           writeTime: 1710298060000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 30707473;
//           articleId: 785198;
//           menuId: 20;
//           cafeUrl: "kbautocar";
//           memberKey: "bW6Sktxv97YiCCJXb6LAcw";
//           authorNickName: "kb차매니저30";
//           cafeName: "●K-B오토카● 중고차구매 중고차판매 수입 국산 자동차";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMjA0MjVfMjc4/MDAxNjUwODUxNDY3NTA2.jQ1ffxDeKl1b0JYC2EzfZbv2k8ewcSlOV5ocWjlcuSMg.NaAS446Fl-ZL034PeIh2mz_0suZ0aL15lX3y5H56C70g.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-1.png";
//           subject: "중고카라반 캠핑트레일러 2021년식 1km 캠핑트레일러  중고차거래사이트";
//           content: "중고카라반 캠핑트레일러 2021년식 1km 캠핑트레일러 중고차거래사이트 차 명 : 캠핑카 캠핑트레일러 제 조 사 : 중대형화물 연 식 : 2021 (2021.03) 주행거리 : 1km 차량가격 : 1,690만원 (84개월 할부시 200,000원) 색 상 : 흰색 연 료 : 휘발유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 파워핸들,파워윈도우,에어컨,풀오토에어컨,썬팅,썬루프,파노라마썬루프,핸들리모컨,알루미늄휠,전동접이식백미러,ECM룸미러,원격시동장치,스마트키,우드그레인,메탈그레인,오토도어록,도난경보기,가죽시트,메모리시트,HID램프,제논램프,네비게이션,GPS,블랙박스,하이패스,공기청정기,DMB,CD플레이어,MP3플레이어,CD체인저,VCD플레이어,DVD플레이어,AV시스템,튜닝스피커,앰프,우퍼,슈퍼비젼계기판,트립컴퓨터,버켓시트,에어댐,스트럿바,범퍼가드,크롬휠,4륜구동, ";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfMTM2/MDAxNzEwMjk3ODQ0OTE5.oLefmHVl4DrMZa_CJW7fA83W0b8GCRBiih0Dxx8HMqcg.06hDpYIOlb42bKxsdoxOTxZZGWmPy1xYxshjXWgkr_kg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc4NTE5OCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0NzN9.mbU5jkoqKCmz_MS2N-A183g4YRHAb7jaUQsT-rFPnFo";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc4NTE5OCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0NzN9.mbU5jkoqKCmz_MS2N-A183g4YRHAb7jaUQsT-rFPnFo";
//           productSale: {
//             productName: "중고카라반 캠핑트레일러 2021년식 1km 캠핑트레일러  중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 200000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "05";
//                 regionCode2: "05140";
//                 regionCode3: "05140106";
//                 regionName1: "광주광역시";
//                 regionName2: "서구";
//                 regionName3: "농성동";
//               },
//               {
//                 regionCode1: "05";
//                 regionCode2: "05140";
//                 regionCode3: "05140117";
//                 regionName1: "광주광역시";
//                 regionName2: "서구";
//                 regionName3: "덕흥동";
//               },
//               {
//                 regionCode1: "05";
//                 regionCode2: "05140";
//                 regionCode3: "05140133";
//                 regionName1: "광주광역시";
//                 regionName2: "서구";
//                 regionName3: "동천동";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 29;
//           writeTime: 1710298043000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 30707478;
//           articleId: 769335;
//           menuId: 21;
//           cafeUrl: "hyundaichachacha";
//           memberKey: "Zk_SGMqdlyI4G5KFFf0siw";
//           authorNickName: "현대차매니저18";
//           cafeName: "●현대차차차● 중고자동차 중고리스 인증중고차 중고차매매";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMjA0MjVfMTk4/MDAxNjUwODUxOTE1MzA5.YhVrn9ipYBldQRRPOpkTX_b-xFgYE7JQgnAjw705ymUg.L8vfVoA6CaGAp6jScl14K7qP5irQN67MSdPt1WL9Otsg.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.png";
//           subject: "중고카라반 캠핑트레일러 2022년식 1km 한국  중고차거래사이트";
//           content: "중고카라반 캠핑트레일러 2022년식 1km 한국 중고차거래사이트 차 명 : 트레일러 한국 제 조 사 : 중대형화물 연 식 : 2022 (2022.09) 주행거리 : 1km 차량가격 : 2,390만원 (84개월 할부시 280,000원) 색 상 : 파란색 연 료 : 휘발유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 냉장고 기타사항 : 무사고 문의전화 : 010-5596-4988";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfMjc5/MDAxNzEwMjk0NDg3NDEx.h2Idl_5Axr9DPduNqp7HxWl6tPdL_77PNVmzD259moIg.xzHvuRzO5wE1IbuwAbwd9ar_DCgoGn0BHYW64ORsZ8cg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2OTMzNSwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.59X9AXW7JKKMBwSqdgyfZWTGj5gijk-23RDrw_DTjrg";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2OTMzNSwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.59X9AXW7JKKMBwSqdgyfZWTGj5gijk-23RDrw_DTjrg";
//           productSale: {
//             productName: "중고카라반 캠핑트레일러 2022년식 1km 한국  중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 280000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "02";
//                 regionCode2: "02250";
//                 regionCode3: "02250106";
//                 regionName1: "경기도";
//                 regionName2: "동두천시";
//                 regionName3: "보산동";
//               },
//               {
//                 regionCode1: "02";
//                 regionCode2: "02250";
//                 regionCode3: "02250109";
//                 regionName1: "경기도";
//                 regionName2: "동두천시";
//                 regionName3: "상봉암동";
//               },
//               {
//                 regionCode1: "02";
//                 regionCode2: "02250";
//                 regionCode3: "02250112";
//                 regionName1: "경기도";
//                 regionName2: "동두천시";
//                 regionName3: "상패동";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 28;
//           writeTime: 1710294662000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 31078863;
//           articleId: 940587;
//           menuId: 12;
//           cafeUrl: "onecarchunggocha";
//           memberKey: "Xb_4IMFb0__7Ue5Hw62XUA";
//           authorNickName: "중고차매니저21";
//           cafeName: "★첫차중고차★허위없는 실매물 중고차★";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAyMjdfMTIg/MDAxNzA5MDE2MTczMzY0.qej48RmO2S9illGcamlyMKnAct7JjcoDUp63ETyTjEgg.Z-R7yob-tr1-1CBnWK_1ji8yZHknNd6_13XtXMK7elIg.PNG/K-235.png";
//           subject: "스타렉스 중고 2019년식 47,708km 2WD 웨건 12인승 스마트 중고차거래사이트";
//           content: "스타렉스 중고 2019년식 47,708km 2WD 웨건 12인승 스마트 중고차거래사이트 차 명 : 더 뉴 그랜드 스타렉스 2WD 웨건 12인승 스마트 제 조 사 : 현대 연 식 : 2019 (2019.02) 주행거리 : 47,708km 차량가격 : 1,950만원 (84개월 할부시 230,000원) 색 상 : 흰색 연 료 : 경유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 가죽시트,트립컴퓨터,열선시트 앞좌석 기타사항 : 무사고 차량깔끔 열선 타이어좋습니다 문의전화 : 010-5847-9975";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfOTAg/MDAxNzEwMjg5NTU0ODE5.90NdSWe8wNXzrsgHHeIx-dXbDHSV9SGYJTBy3YBkY7Ag.o9xf9Vey1DvsuiPopr2w_bZSEqYn1hU6q6yebocBd0Yg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MDU4NywiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzg4NjN9.GMMTixthsP9inHtcr0E4xTUrbcxCRlCzqNEbzmdDO94";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk0MDU4NywiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzg4NjN9.GMMTixthsP9inHtcr0E4xTUrbcxCRlCzqNEbzmdDO94";
//           productSale: {
//             productName: "스타렉스 중고 2019년식 47,708km 2WD 웨건 12인승 스마트 중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 19500000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "17";
//                 regionCode2: "17110";
//                 regionCode3: "17110108";
//                 regionName1: "세종특별자치시";
//                 regionName2: "세종특별자치시";
//                 regionName3: "새롬동";
//               },
//               {
//                 regionCode1: "17";
//                 regionCode2: "17110";
//                 regionCode3: "17110115";
//                 regionName1: "세종특별자치시";
//                 regionName2: "세종특별자치시";
//                 regionName3: "산울동";
//               },
//               {
//                 regionCode1: "17";
//                 regionCode2: "17110";
//                 regionCode3: "17110119";
//                 regionName1: "세종특별자치시";
//                 regionName2: "세종특별자치시";
//                 regionName3: "세종동";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 28;
//           writeTime: 1710289730000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 30707478;
//           articleId: 768024;
//           menuId: 10;
//           cafeUrl: "hyundaichachacha";
//           memberKey: "sJWXNP-eGYp_nEN1YsTj9g";
//           authorNickName: "현대차매니저14";
//           cafeName: "●현대차차차● 중고자동차 중고리스 인증중고차 중고차매매";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMjA0MjVfMTk4/MDAxNjUwODUxOTE1MzA5.YhVrn9ipYBldQRRPOpkTX_b-xFgYE7JQgnAjw705ymUg.L8vfVoA6CaGAp6jScl14K7qP5irQN67MSdPt1WL9Otsg.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.png";
//           subject: "스타렉스 중고 2020년식 32,791km 2WD 밴 3인승 스마트 중고차거래사이트";
//           content: "스타렉스 중고 2020년식 32,791km 2WD 밴 3인승 스마트 중고차거래사이트 차 명 : 더 뉴 그랜드 스타렉스 2WD 밴 3인승 스마트 제 조 사 : 현대 연 식 : 2020 (2019.11) 주행거리 : 32,791km 차량가격 : 2,230만원 (84개월 할부시 260,000원) 색 상 : 회색 연 료 : 경유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 에어컨,전동접이식백미러,오토도어록 기타사항 : 무사고 문의전화 : 010-5596-4988";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfMTkx/MDAxNzEwMjgxNTA4MzAz.14f5-TazQDdap342iwKprYW974GHfGChXFjeJMi_GcYg.0HYJtDh3Ayu9wXr8uop8nW-R6oLcKDpbovW0AYoTfKYg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2ODAyNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.9xcIVbkT-tuwS19lSm4pT-avSvywML-rMBMxfcjqSpw";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2ODAyNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.9xcIVbkT-tuwS19lSm4pT-avSvywML-rMBMxfcjqSpw";
//           productSale: {
//             productName: "스타렉스 중고 2020년식 32,791km 2WD 밴 3인승 스마트 중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 260000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "06";
//                 regionCode2: "06710";
//                 regionCode3: "06710259";
//                 regionName1: "대구광역시";
//                 regionName2: "달성군";
//                 regionName3: "유가읍";
//               },
//               {
//                 regionCode1: "06";
//                 regionCode2: "06710";
//                 regionCode3: "06710262";
//                 regionName1: "대구광역시";
//                 regionName2: "달성군";
//                 regionName3: "옥포읍";
//               },
//               {
//                 regionCode1: "06";
//                 regionCode2: "06710";
//                 regionCode3: "06710330";
//                 regionName1: "대구광역시";
//                 regionName2: "달성군";
//                 regionName3: "하빈면";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 24;
//           writeTime: 1710281683000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 30707478;
//           articleId: 767004;
//           menuId: 10;
//           cafeUrl: "hyundaichachacha";
//           memberKey: "c6XmntvqU9746-HkpUfV2A";
//           authorNickName: "현대차매니저27";
//           cafeName: "●현대차차차● 중고자동차 중고리스 인증중고차 중고차매매";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMjA0MjVfMTk4/MDAxNjUwODUxOTE1MzA5.YhVrn9ipYBldQRRPOpkTX_b-xFgYE7JQgnAjw705ymUg.L8vfVoA6CaGAp6jScl14K7qP5irQN67MSdPt1WL9Otsg.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.png";
//           subject: "르노마스터 캠핑카 2019년식 63,009km 캠핑카  중고차거래사이트";
//           content: "르노마스터 캠핑카 2019년식 63,009km 캠핑카 중고차거래사이트 차 명 : 마스터 밴 캠핑카 제 조 사 : 르노(삼성) 연 식 : 2019 (2019.06) 주행거리 : 63,009km 차량가격 : 3,590만원 (84개월 할부시 420,000원) 색 상 : 검정색 연 료 : 경유 변 속 기 : 수동 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 에어컨,블랙박스 기타사항 : 무사고(캠핑카 / 구변완료) 설명글 참조 문의전화 : 010-5596-4988";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTNfMTc2/MDAxNzEwMjYxNzgzMTQz.AaJoYdhiDSBs2tQOgXzLSocOsh5a6wJR_Mt8seg3Gm0g.A04B3XQcyrjpwPjmTVszsDy5R4oSgX1jnRLhtEFfxL0g.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2NzAwNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.SkqThnOOYYDvwHxDmI9E-KFebIJyyP6NHQ76Mc__7hU";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2NzAwNCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.SkqThnOOYYDvwHxDmI9E-KFebIJyyP6NHQ76Mc__7hU";
//           productSale: {
//             productName: "르노마스터 캠핑카 2019년식 63,009km 캠핑카  중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 420000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "15";
//                 regionCode2: "15250";
//                 regionCode3: "15250101";
//                 regionName1: "충청남도";
//                 regionName2: "계룡시";
//                 regionName3: "금암동";
//               },
//               {
//                 regionCode1: "15";
//                 regionCode2: "15250";
//                 regionCode3: "15250310";
//                 regionName1: "충청남도";
//                 regionName2: "계룡시";
//                 regionName3: "두마면";
//               },
//               {
//                 regionCode1: "15";
//                 regionCode2: "15250";
//                 regionCode3: "15250330";
//                 regionName1: "충청남도";
//                 regionName2: "계룡시";
//                 regionName3: "신도안면";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 28;
//           writeTime: 1710261946000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 30707478;
//           articleId: 766587;
//           menuId: 10;
//           cafeUrl: "hyundaichachacha";
//           memberKey: "A7DoOVPGSGyRcGnjuTTYEA";
//           authorNickName: "현대차50";
//           cafeName: "●현대차차차● 중고자동차 중고리스 인증중고차 중고차매매";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyMjA0MjVfMTk4/MDAxNjUwODUxOTE1MzA5.YhVrn9ipYBldQRRPOpkTX_b-xFgYE7JQgnAjw705ymUg.L8vfVoA6CaGAp6jScl14K7qP5irQN67MSdPt1WL9Otsg.PNG/%EC%A0%9C%EB%AA%A9_%EC%97%86%EC%9D%8C-2.png";
//           subject: "스타렉스 중고 2019년식 55,339km 2WD 어반 9인승 익스클루시브 중고차거래사이트";
//           content: "스타렉스 중고 2019년식 55,339km 2WD 어반 9인승 익스클루시브 중고차거래사이트 차 명 : 더 뉴 그랜드 스타렉스 2WD 어반 9인승 익스클루시브 제 조 사 : 현대 연 식 : 2019 (2018.08) 주행거리 : 55,339km 차량가격 : 2,370만원 (84개월 할부시 280,000원) 색 상 : 회색 연 료 : 경유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 네비게이션 기타사항 : 문의전화 : 010-5596-4988";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTJfNTgg/MDAxNzEwMjUzOTkyMDQ0.edZsQywCT1XtGiOt7s62Y0KsFIH2Rr0tbenHumSDhhMg.qJwGaYqLr8qwGVFSflfHeDCGKWLEVr1JePk7e3d5KZkg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2NjU4NywiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.2TiDrBhBD2KvPpuUXhoIZ2PdVnUiRMq_UFDUhjkKL_g";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjc2NjU4NywiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzA3MDc0Nzh9.2TiDrBhBD2KvPpuUXhoIZ2PdVnUiRMq_UFDUhjkKL_g";
//           productSale: {
//             productName: "스타렉스 중고 2019년식 55,339km 2WD 어반 9인승 익스클루시브 중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 280000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000028";
//               category3Id: "50001304";
//               category1Name: "스포츠,레저";
//               category2Name: "캠핑";
//               category3Name: "기타캠핑용품";
//             };
//             regionList: [
//               {
//                 regionCode1: "15";
//                 regionCode2: "15800";
//                 regionCode3: "15800253";
//                 regionName1: "충청남도";
//                 regionName2: "홍성군";
//                 regionName3: "광천읍";
//               },
//               {
//                 regionCode1: "15";
//                 regionCode2: "15800";
//                 regionCode3: "15800360";
//                 regionName1: "충청남도";
//                 regionName2: "홍성군";
//                 regionName3: "결성면";
//               },
//               {
//                 regionCode1: "15";
//                 regionCode2: "15800";
//                 regionCode3: "15800380";
//                 regionName1: "충청남도";
//                 regionName2: "홍성군";
//                 regionName3: "갈산면";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 28;
//           writeTime: 1710254169000;
//         };
//       },
//       {
//         type: "ARTICLE";
//         item: {
//           cafeId: 31077272;
//           articleId: 958064;
//           menuId: 11;
//           cafeUrl: "chunggochagmarket";
//           memberKey: "uhAS0rW-kuUpuoebR3OfIQ";
//           authorNickName: "중고차매니저23";
//           cafeName: "★중고차G마켓★허위없는실매물중고차★";
//           cafeThumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAyMjdfODIg/MDAxNzA5MDE2NDM1MjUy.QWA7vTn-OU63swmw7s5xmRpRKa9hahFPa5rxy_JWOPEg.A2PHcnQTk_csAzBdF2W6yc7Ex8BtCKB-uANzXtna6pEg.PNG/K-236.png";
//           subject: "싼타페 중고 가격 2023년식 9,016km 가솔린 2.5T 2WD 캘리그래피  중고차거래사이트";
//           content: "싼타페 중고 가격 2023년식 9,016km 가솔린 2.5T 2WD 캘리그래피 중고차거래사이트 차 명 : 더 뉴 싼타페 가솔린 2.5T 2WD 캘리그래피 제 조 사 : 현대 연 식 : 2023 (2023.03) 주행거리 : 9,016km 차량가격 : 3,370만원 (84개월 할부시 400,000원) 색 상 : 회색 연 료 : 휘발유 변 속 기 : 오토 차량번호 : 상세이미지 참조 사고유무 : 하단 성능기록부 참조 옵 션 : 파워핸들,파워윈도우,에어컨,풀오토에어컨,썬팅,핸들리모컨,알루미늄휠,전동접이식백미러,ECM룸미러,원격시동장치,스마트키,우드그레인,메탈그레인,오토도어록,도난경보기,가죽시트,메모리시트,제논램프,네비게이션,GPS,블랙박스,하이패스,공기청정기,DMB,AV시스템,슈퍼비젼계기판,트립컴퓨터,크롬휠,HUD 헤드 업 디스플레이,LDWS 차선이탈경보장치,감지센서 전방,감지센서 후방,스탑앤고,오토라이트,자동주차시스템,전동 조절 스티어링  ";
//           thumbnailImageUrl: "https://cafeptthumb-phinf.pstatic.net/MjAyNDAzMTJfNDEg/MDAxNzEwMjUzMzA2MTI1.0E1ekNksAH4TMT7tzYMQoUcOl2fb7Xx6q83f9yAXNDQg.GOiw9in1FPFHfkhfkVgifMIxl3NpZb_8q73i5mn9Y1Mg.JPEG/10.jpg";
//           sc: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk1ODA2NCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzcyNzJ9.au6i3JsdssnCIXLx18rZMUvXxuCsC1Yi30QR6wS-rnw";
//           art: "aW50ZXJuYWwtY2FmZS13ZWItc2VjdGlvbi1zZWFyY2gtbGlzdA.eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjYWZlVHlwZSI6IkNBRkVfSUQiLCJhcnRpY2xlSWQiOjk1ODA2NCwiaXNzdWVkQXQiOjE3MTAzMDczOTUxNTgsImNhZmVJZCI6MzEwNzcyNzJ9.au6i3JsdssnCIXLx18rZMUvXxuCsC1Yi30QR6wS-rnw";
//           productSale: {
//             productName: "싼타페 중고 가격 2023년식 9,016km 가솔린 2.5T 2WD 캘리그래피  중고차거래사이트";
//             escrow: true;
//             saleStatus: "ON_SALE";
//             cost: 33700000;
//             productCondition: "ALMOST_NEW";
//             tradeCategory: {
//               category1Id: "50000007";
//               category2Id: "50000163";
//               category3Id: "50000990";
//               category1Name: "스포츠,레저";
//               category2Name: "낚시";
//               category3Name: "낚싯대";
//             };
//             regionList: [
//               {
//                 regionCode1: "11";
//                 regionCode2: "11245";
//                 regionCode3: "11245104";
//                 regionName1: "인천광역시";
//                 regionName2: "계양구";
//                 regionName3: "서운동";
//               },
//               {
//                 regionCode1: "11";
//                 regionCode2: "11245";
//                 regionCode3: "11245107";
//                 regionName1: "인천광역시";
//                 regionName2: "계양구";
//                 regionName3: "병방동";
//               },
//               {
//                 regionCode1: "11";
//                 regionCode2: "11245";
//                 regionCode3: "11245112";
//                 regionName1: "인천광역시";
//                 regionName2: "계양구";
//                 regionName3: "상야동";
//               }
//             ];
//             deliveryTypeList: ["ONLINE", "DELIVERY", "MEET"];
//           };
//           townCafe: false;
//           attachImageCount: 28;
//           writeTime: 1710253471000;
//         };
//       }
//#endregion

//#region recommendCategoryList Example
// [
//     {
//       categoryId: "50000028",
//       categoryName: "캠핑",
//       productCount: 70073,
//     },
//     {
//       categoryId: "50000027",
//       categoryName: "등산",
//       productCount: 3049,
//     },
//     {
//       categoryId: "50000035",
//       categoryName: "오토바이/스쿠터",
//       productCount: 1194,
//     },
//     {
//       categoryId: "50000029",
//       categoryName: "골프",
//       productCount: 531,
//     },
//     {
//       categoryId: "50000038",
//       categoryName: "농구",
//       productCount: 114,
//     },
//     {
//       categoryId: "50000163",
//       categoryName: "낚시",
//       productCount: 102,
//     },
//     {
//       categoryId: "50000030",
//       categoryName: "헬스",
//       productCount: 100,
//     },
//     {
//       categoryId: "50000161",
//       categoryName: "자전거",
//       productCount: 99,
//     },
//     {
//       categoryId: "50000022",
//       categoryName: "기타스포츠용품",
//       productCount: 94,
//     },
//     {
//       categoryId: "50000045",
//       categoryName: "볼링",
//       productCount: 80,
//     },
//     {
//       categoryId: "50000164",
//       categoryName: "수영",
//       productCount: 64,
//     },
//     {
//       categoryId: "50000037",
//       categoryName: "야구",
//       productCount: 47,
//     },
//     {
//       categoryId: "50000162",
//       categoryName: "스키/보드",
//       productCount: 45,
//     },
//     {
//       categoryId: "50000036",
//       categoryName: "축구",
//       productCount: 39,
//     },
//     {
//       categoryId: "50000034",
//       categoryName: "스케이트/보드/롤러",
//       productCount: 23,
//     },
//     {
//       categoryId: "50000041",
//       categoryName: "배드민턴",
//       productCount: 21,
//     },
//     {
//       categoryId: "50000053",
//       categoryName: "스포츠액세서리",
//       productCount: 15,
//     },
//     {
//       categoryId: "50000042",
//       categoryName: "테니스",
//       productCount: 14,
//     },
//     {
//       categoryId: "50000031",
//       categoryName: "요가/필라테스",
//       productCount: 14,
//     },
//     {
//       categoryId: "50000021",
//       categoryName: "당구용품",
//       productCount: 11,
//     },
//     {
//       categoryId: "50000040",
//       categoryName: "탁구",
//       productCount: 11,
//     },
//     {
//       categoryId: "50000033",
//       categoryName: "인라인스케이트",
//       productCount: 10,
//     },
//     {
//       categoryId: "50000052",
//       categoryName: "수련용품",
//       productCount: 10,
//     },
//     {
//       categoryId: "50000046",
//       categoryName: "스킨스쿠버",
//       productCount: 9,
//     },
//     {
//       categoryId: "50000049",
//       categoryName: "권투",
//       productCount: 9,
//     },
//     {
//       categoryId: "50000048",
//       categoryName: "댄스",
//       productCount: 6,
//     },
//     {
//       categoryId: "50000050",
//       categoryName: "보호용품",
//       productCount: 3,
//     },
//     {
//       categoryId: "50000020",
//       categoryName: "마라톤용품",
//       productCount: 3,
//     },
//     {
//       categoryId: "50000047",
//       categoryName: "검도",
//       productCount: 1,
//     },
//     {
//       categoryId: "50000044",
//       categoryName: "족구",
//       productCount: 1,
//     },
//     {
//       categoryId: "50000039",
//       categoryName: "배구",
//       productCount: 1,
//     }
//   ]
//#endregion
