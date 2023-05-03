import axios from "axios";
import { load } from "cheerio";
import request from "request";
import { l } from "../console";
import { headers } from "./headers";
import { productURLDataType, IherbType } from "./updateByIherb";
import { NODE_API_URL } from "../common";
import { uniq } from "lodash";
export const getProductDescData = (urlData: productURLDataType): Promise<IherbType | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      await request(urlData.product_url, headers(), async (error, _, body) => {
        if (error) {
          l("error request", "red", error);
          return reject([]);
        }
        const $ = load(body);
        // # 아이허브 의 제품id
        const iherbProductId = urlData.product_url.slice(
          urlData.product_url.lastIndexOf("/") + 1,
          urlData.product_url.length
        );

        // # 아이허브 의 제품이미지
        const iherbProductImage = $("img#iherb-product-image").attr("src") || null;
        // # 아이허브 의 제품이름
        const iherbProductName =
          $("h1#name")
            .text()
            .replace(/\([^)]+\)/gi, "") // 괄호삭제
            .trim() || null;

        // # 아이허브 품절 여부 가져오기
        const isStock = $(".text-primary").text().trim() === "재고있음"; //품절인지 아닌지 -> true면 재고있음

        // # 아이허브 슈퍼할인 여부 가져오기 -> 매일 못가져오므로 삭제
        // const isSuperSale = $(".flag-Special > bdi").text().includes("슈퍼 세일!");
        // # 아이허브 가격
        const price =
          $("div.price-container > b").html()?.trim().replace(/[₩,]/gi, "") ||
          $(".price-inner-text > p").html()?.trim().replace(/[₩,]/gi, "") ||
          null; //가격(원 기준)

        // # 아이허브 랭킹 가져오기
        const rankList: string[] = [];
        const rankStrList: string[] = []; //func_content
        $(".best-selling-rank > div").each((i, e) => {
          const textList = $(e).find("strong").text().trim().split(" in");
          const rank = textList[0].replace(/[^0-9]/gi, "");
          const category = textList[1].replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9]/gi, "");
          //치약같은 특정 카테고리 배제
          if (getExpceptionRankCategory(category)) return resolve(null);
          rankStrList.push(category);
          rankList.push(rank + "위 : " + category);
        });
        const rankListString = rankList.join("\n");
        // # 아이허브 배송비 이벤트 여부
        const isDeliveryEvent = $(".free-shipping-text").text().trim().slice(0, 18) === "₩40,000 이상 주문 시 무료"; //4만원 이상 주문시 무료배송 맞는지여부

        // # 아이허브 배송비 이벤트 체크 및 배송료 계산
        let delivery: number = 5000;
        if (price && isDeliveryEvent && Number(price) > 40000) delivery = 0; //제품이 4만원이상일 경우 배송비 무료

        // # 아이허브 제품 설명 가져오기
        const descList: { title: string; desc: string }[] = [];
        $(".inner-content > div > div > div > div").each((i, e) => {
          if (i === 0) {
            const title = $(e).find("div > div > h3 > strong").html() || "";
            const descTagList: string[] = [];
            $(e)
              .find("div > div > div > ul > li")
              .each((i, e) => {
                const desc = $(e)
                  .text()
                  .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9- ]/gi, "")
                  .trim();
                descTagList.push(desc);
              });

            if (title) descList.push({ title, desc: descTagList.join("\n") });
          } else {
            const title = $(e).find("div > div > h3 > strong").html() || "";
            const desc = $(e).find("div > div > div").text().trim().replace(/  /gi, "\n");
            if (title) descList.push({ title, desc });
          }
        });

        const description = descList.filter((t) => t.title === "상품 설명")[0]?.desc;
        const descriptionUse = descList.filter((t) => t.title === "상품 사용법")[0]?.desc || null;
        const descriptionOtherIngredient = descList.filter((t) => t.title === "포함된 다른 성분들")[0]?.desc || null;
        const descriptionWarn = descList.filter((t) => t.title === "주의사항")[0]?.desc || null;
        // # 아이허브 영양소 가져오기+괄호 제거하기
        // 1회 제공량당 하루 영양소 기준치 percent
        let ingredientRaw = ""; //영양정보전체
        let ingredientCount = ""; //1회제공량, 용기당 제공횟수 저장됨
        let ingredientAmount = ""; //영양정보 함유량만
        const ingredientList: string[] = [];
        $(`table > tbody > tr`).each((i, e) => {
          if (i === 0) return;
          const div = $(e);
          const text = div.text();
          const isCol = div.find("td").attr("colspan") === "3";

          if (isCol) {
            if (i === 1) {
              const tr = text.replace("1 회", "1회").replace(" 정", "정").trim();
              ingredientCount += tr + "\n";
              ingredientRaw += tr + "\n";
              return;
            }
            if (i === 2) {
              const tr = text
                .replace("용기당 제공 횟수", "1회제공량 제공 횟수")
                .replace("컨테이너 당 봉사 횟수", "1회제공량 제공 횟수")
                .trim();
              const result = tr[tr.length - 1] === "회" ? tr : tr + "회";
              ingredientCount += result + "\n";
              ingredientRaw += result + "\n";
              return;
            }
          }
          if (text.includes("서빙 당") || text.includes("캡슐") || text.includes("스쿱")) return;

          let titleTemp: string | null =
            div.find("td:nth-child(1) > strong").html() ||
            div.find("td:nth-child(1) > p").html() ||
            div.find("td:nth-child(1)").html() ||
            "";

          titleTemp = getGroupIngredient(
            titleTemp
              .slice(0, titleTemp.indexOf("<br>") === -1 ? titleTemp.length : titleTemp.indexOf("<br>"))
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9]/gi, "")
              .replace(/sup/g, "")
              .replace(/span/g, "")
              .replace(/nbsp/g, "")
              .trim() || null
          );
          const title = titleTemp;

          const amount =
            div
              .find("td:nth-child(2)")
              .text()
              .replace(/†/g, "")
              .replace(/<br>/g, "")
              .replace(/ /g, "")
              .replace(/,/g, "")
              .replace(/¹/g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          const percent =
            div
              .find("td:nth-child(3)")
              .text()
              .replace(/ /g, "")
              .replace(/<br>/g, "")
              .replace(/†/g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          if (!title || title.length > 30) return;
          if (amount && title && title.length < 12) {
            ingredientAmount += title + " : " + amount + "\n";
            if (isYagiIngredientRank(title)) ingredientList.push(title);
          }
          ingredientRaw += title + " : " + amount + " , " + percent + "\n";
        });

        // # 아이허브 리뷰 평점, 리뷰수, 리뷰링크 가져오기
        // const r = $("div.rating > a").attr("title")?.trim();
        const reviewUrl = $("div.rating > a.stars").attr("href") || null;
        const ratingDiv = $("div.rating > a.stars").attr("title") || "";
        const reviewCount = ratingDiv.slice(ratingDiv.indexOf("-") + 2, ratingDiv.indexOf("구매")).trim() || null;
        const rating = ratingDiv.slice(0, ratingDiv.indexOf("/")).trim() || null;

        const data: IherbType = {
          iherb_product_id: iherbProductId,
          iherb_product_name: iherbProductName,
          iherb_product_brand: urlData.brand,
          iherb_product_image: iherbProductImage,
          is_stock: isStock ? "1" : "0",
          // is_super_sale: isSuperSale ? "1" : "0",
          discount_price: price,
          rank: rankListString,
          is_delivery_event: isDeliveryEvent ? "1" : "0",
          delivery_price: delivery,
          description: description,
          description_use: descriptionUse,
          description_other_ingredient: descriptionOtherIngredient,
          description_warn: descriptionWarn,
          ingredient_amount: ingredientAmount.slice(0, ingredientAmount.length - 1),
          ingredient_raw: ingredientRaw,
          ingredient_count: ingredientCount,
          rating: rating,
          review_count: reviewCount,
          review_url: reviewUrl,
          list_url: urlData.list_url,
          product_url: urlData.product_url,
          primary_ingredients: uniq(ingredientList).slice(0, 10).join(", "),
          func_content: uniq(rankStrList).slice(0, 10).join(", "),
        };
        // console.log(data);

        if (iherbProductName === null) {
          l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다. iherbProductName = null");
          return resolve(null);
        }
        await axios
          .post(`${NODE_API_URL}/crawling/product/iherb`, data)
          .catch((d) => l("ERR Data", "red", "iherb 데이터 중 일부가 누락되었습니다."));
        return resolve(data);
      });
    } catch (error) {
      l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다. (1)" + error);
      return resolve(null);
    }
  });
};

const getGroupIngredient = (ingredient: string | null) => {
  if (!ingredient) return null;
  if (ingredient.includes("베타") && ingredient.includes("글루칸")) return "베타글루칸";

  if (ingredient.includes("순수고급이온성마그네슘")) return "순수고급이온화마그네슘";
  if (ingredient.includes("칼슘d글루카레이트")) return "칼슘D글루카레이트";
  if (ingredient.includes("Ashwagandha")) return "아시와간다";
  if (ingredient.includes("Astaxanthin")) return "아스타잔틴";
  if (ingredient.includes("Cholesterol")) return "콜레스테롤";
  if (ingredient.includes("CoenzymeB12")) return "코엔자임B12";
  if (ingredient.includes("CoenzymeQ10")) return "코엔자임Q10";
  if (ingredient.includes("CynatineHNS")) return "시나틴HNS";
  if (ingredient.includes("Eleuthero뿌리")) return "엘레테로뿌리";
  if (ingredient.includes("EnzymeBlend")) return "효소혼합물";
  if (ingredient.includes("FloraGLO금잔화")) return "플로라글로골드플레임";
  if (ingredient.includes("FloraGLO루테인")) return "플로라글루틴";
  if (ingredient.includes("LIsoleucine")) return "L이소류신";
  if (ingredient.includes("LMethionine")) return "L메티오닌";
  if (ingredient.includes("LTryptophan")) return "L트립토판";
  if (ingredient.includes("ProteaseIII")) return "프로테아제III";
  if (ingredient.includes("Resveratrol")) return "레스베라트롤";
  if (ingredient.includes("Rhodiola추출물")) return "로디올라추출물";
  if (ingredient.includes("RutinPowder")) return "루틴파우더";
  if (ingredient.includes("SawPalmetto")) return "쏘팔메토";
  if (ingredient.includes("Sunphenon녹차")) return "선페논논차";
  if (ingredient.includes("구리클로로필린나트륨")) return "구리클로로핀나트륨";
  if (ingredient.includes("악마의발톱뿌리추출물")) return "악마의발톱뿌리추출물";
  if (ingredient.includes("알리신을방출하는마늘")) return "알리신마늘";
  if (ingredient.includes("칼슘식물전체에서추출")) return "칼슘";
  if (ingredient.includes("피리독살5포스페이트")) return "피리독살포스페이트";
  if (ingredient.includes("허브면역력강화혼합물")) return "허브면역력강화혼합물";
  if (ingredient.includes("환원형코엔자임Q10")) return "환원형코엔자임Q10";
  if (ingredient.includes("AmlaPowder")) return "암라파우더";
  if (ingredient.includes("DevilsClaw")) return "악마의발톱";
  if (ingredient.includes("Isoleucine")) return "이소류신";
  if (ingredient.includes("LCarnitine")) return "L카르니틴";
  if (ingredient.includes("LGlutamine")) return "L글루타민";
  if (ingredient.includes("LHistidine")) return "L히스티딘";
  if (ingredient.includes("LThreonine")) return "L트레오닌";
  if (ingredient.includes("Methionine")) return "메티오닌";
  if (ingredient.includes("Molybdenum")) return "몰리브덴";
  if (ingredient.includes("OreganoOil")) return "오레가노오일";
  if (ingredient.includes("ProteaseIl")) return "프로테아제II";
  if (ingredient.includes("Pycnogenol")) return "피크노제놀";
  if (ingredient.includes("Reishi버섯분말")) return "레이시버섯분말";
  if (ingredient.includes("Reliefiber")) return "릴리프이버";
  if (ingredient.includes("Rhodiola분말")) return "로디올라분말";
  if (ingredient.includes("Rhodiolife")) return "로디올라이프";
  if (ingredient.includes("Riboflavin")) return "리보플라빈";
  if (ingredient.includes("RoyalJelly")) return "로얄젤리";
  if (ingredient.includes("Schisandra")) return "시산드라";
  if (ingredient.includes("Tryptophan")) return "트립토판";
  if (ingredient.includes("VitaminB12")) return "비타민B12";
  if (ingredient.includes("감마아미노뷰티릭산")) return "감마아미노부티르산";
  if (ingredient.includes("구리클로로핀나트륨")) return "구리클로로핀나트륨";
  if (ingredient.includes("글루코사민설페이트")) return "글루코사민설페이트";
  if (ingredient.includes("루테인카로티노이드")) return "루테인카로티노이드";
  if (ingredient.includes("밀크씨슬씨앗추출물")) return "밀크시슬씨앗추출물";
  if (ingredient.includes("산안정성프로테아제")) return "산안정성프로테아제";
  if (ingredient.includes("아미노산혼합물성분")) return "아미노산혼합물";
  if (ingredient.includes("유기농면역력혼합물")) return "유기농면역력혼합물";
  if (ingredient.includes("캐모마일추출물41")) return "카모마일";
  if (ingredient.includes("포스파티딜이노시톨")) return "포스파티딜이노시톨";
  if (ingredient.includes("AquaminTG")) return "아쿠아민TG";
  if (ingredient.includes("Berberine")) return "베르베린";
  if (ingredient.includes("Boswellin")) return "보스웰린";
  if (ingredient.includes("Bromelain")) return "브로멜라인";
  if (ingredient.includes("Cellulase")) return "셀룰라아제";
  if (ingredient.includes("Chamomile")) return "카모마일";
  if (ingredient.includes("Chlorella")) return "클로렐라";
  if (ingredient.includes("DHA중성지방형태")) return "오메가3중성지방";
  if (ingredient.includes("Histidine")) return "히스티딘";
  if (ingredient.includes("LArginine")) return "L아르기닌";
  if (ingredient.includes("LCysteine")) return "L시스테인";
  if (ingredient.includes("LTyrosine")) return "L티로신";
  if (ingredient.includes("Magnesium")) return "마그네슘";
  if (ingredient.includes("Manganese")) return "망간";
  if (ingredient.includes("MSMPowder")) return "MSM분말";
  if (ingredient.includes("Potassium")) return "칼륨";
  if (ingredient.includes("PreforPro")) return "PreforPro";
  if (ingredient.includes("ProteaseI")) return "프로테아제I";
  if (ingredient.includes("Quercetin")) return "퀘르세틴";
  if (ingredient.includes("Spirulina")) return "스피룰리나";
  if (ingredient.includes("Threonine")) return "트레오닌";
  if (ingredient.includes("Ubiquinol")) return "유비퀴놀";
  if (ingredient.includes("VitaminB2")) return "비타민B2";
  if (ingredient.includes("VitaminB6")) return "비타민B6";
  if (ingredient.includes("VitaminD3")) return "비타민D3";
  if (ingredient.includes("VitaminK1")) return "비타민K1";
  if (ingredient.includes("VitaminK2")) return "비타민K2";
  if (ingredient.includes("메틸설포닐메테인")) return "메틸설포닐메탄";
  if (ingredient.includes("무가공CoQ10")) return "무가공큐엔자임큐텐";
  if (ingredient.includes("미분화l글루타민")) return "미분화L글루타민";
  if (ingredient.includes("베타인에이치씨엘")) return "베타인염산염";
  if (ingredient.includes("블랙코호시추출물")) return "블랙코호시추출물";
  if (ingredient.includes("블루리치블루베리")) return "블루리치블루베리";
  if (ingredient.includes("빌베리열매추출물")) return "빌베리열매추출물";
  if (ingredient.includes("오메가오일혼합물")) return "오메가오일혼합물";
  if (ingredient.includes("프로테아제III")) return "프로테아제III";
  if (ingredient.includes("프로테오세스펩톤")) return "프로테오세스펩톤";
  if (ingredient.includes("피리독살5인산염")) return "피리독살인산염";
  if (ingredient.includes("피쉬오일제공성분")) return "피쉬오일";
  if (ingredient.includes("헤스페리딘추출물")) return "헤스페리딘추출물";
  if (ingredient.includes("Allulose")) return "알룰로스";
  if (ingredient.includes("AloeVera")) return "알로에베라";
  if (ingredient.includes("Arginine")) return "아르기닌";
  if (ingredient.includes("Celadrin")) return "셀라드린";
  if (ingredient.includes("Chloride")) return "염화물";
  if (ingredient.includes("Chromium")) return "크롬";
  if (ingredient.includes("Cysteine")) return "시스테인";
  if (ingredient.includes("Diastase")) return "디아스타제";
  if (ingredient.includes("ForsLean")) return "포슬린";
  if (ingredient.includes("Inositol")) return "이노시톨";
  if (ingredient.includes("L시스테인HCI")) return "L시스테인염산염";
  if (ingredient.includes("LAlanine")) return "L알라닌";
  if (ingredient.includes("LLeucine")) return "L류신";
  if (ingredient.includes("LProline")) return "L프롤린";
  if (ingredient.includes("Lycopene")) return "리코펜";
  if (ingredient.includes("Lysozyme")) return "리소자임";
  if (ingredient.includes("Megasorb")) return "메가소브";
  if (ingredient.includes("PauDArco")) return "파우다르코";
  if (ingredient.includes("Rosemary")) return "로즈메리";
  if (ingredient.includes("Selenium")) return "셀레늄";
  if (ingredient.includes("Thiamine")) return "티아민";
  if (ingredient.includes("Tyrosine")) return "티로신";
  if (ingredient.includes("Vanadium")) return "바나듐";
  if (ingredient.includes("VitaminA")) return "비타민A";
  if (ingredient.includes("VitaminC")) return "비타민C";
  if (ingredient.includes("VitaminD")) return "비타민D";
  if (ingredient.includes("VitaminE")) return "비타민E";
  if (ingredient.includes("VitaminK")) return "비타민K";
  if (ingredient.includes("가수분해콜라겐")) return "가수분해콜라겐";
  if (ingredient.includes("글루코사민황산")) return "글루코사민황산염";
  if (ingredient.includes("레몬밤잎추출물")) return "레몬밤잎추출물";
  if (ingredient.includes("리놀레익애씨드")) return "리놀레산";
  if (ingredient.includes("밀크씨슬추출물")) return "밀크시슬추출물";
  if (ingredient.includes("밀크티슬추출물")) return "밀크시슬추출물";
  if (ingredient.includes("발레리안추출물")) return "발레리안추출물";
  if (ingredient.includes("부틸프탈라이드")) return "부틸프탈라이드";
  if (ingredient.includes("산사나무추출물")) return "산사나무추출물";
  if (ingredient.includes("산사나무추출물")) return "산사나무추출물";
  if (ingredient.includes("생강뿌리추출물")) return "생강뿌리추출물";
  if (ingredient.includes("소팔메토추출물")) return "소팔메토추출물";
  if (ingredient.includes("쏘팔메토추출물")) return "쏘팔메토추출물";
  if (ingredient.includes("아연L카르노신")) return "아연L카르노신";
  if (ingredient.includes("영지버섯추출물")) return "영지버섯추출물";
  if (ingredient.includes("코엔자임Q10")) return "코엔자임Q10";
  if (ingredient.includes("크랜베리농축물")) return "크랜베리농축물";
  if (ingredient.includes("판크레아틴효소")) return "판크레아틴효소";
  if (ingredient.includes("프로테아제펩톤")) return "프로테아제펩톤";
  if (ingredient.includes("프로테아제II")) return "프로테아제II";
  if (ingredient.includes("프로테오스펩톤")) return "프로테오스펩톤";
  if (ingredient.includes("피쉬오일농축물")) return "피쉬오일농축물";
  if (ingredient.includes("Alanine")) return "알라닌";
  if (ingredient.includes("Amylase")) return "아밀라아제";
  if (ingredient.includes("Aquamin")) return "아쿠아민";
  if (ingredient.includes("Calcium")) return "칼슘";
  if (ingredient.includes("Choline")) return "콜린";
  if (ingredient.includes("d감마토코페롤")) return "D감마토코페롤";
  if (ingredient.includes("Fortify")) return "포티파이";
  if (ingredient.includes("Glycine")) return "글리신";
  if (ingredient.includes("Lactase")) return "락타아제";
  if (ingredient.includes("Leucine")) return "류신";
  if (ingredient.includes("LLysine")) return "L라이신";
  if (ingredient.includes("Llysine")) return "리신";
  if (ingredient.includes("LSerine")) return "L세린";
  if (ingredient.includes("LValine")) return "L발린";
  if (ingredient.includes("Magtein")) return "마그테인";
  if (ingredient.includes("Proline")) return "프롤린";
  if (ingredient.includes("Protein")) return "단백질";
  if (ingredient.includes("Silicon")) return "실리콘";
  if (ingredient.includes("Soursop")) return "사르솝";
  if (ingredient.includes("Sterols")) return "스테롤스";
  if (ingredient.includes("Thiamin")) return "티아민";
  if (ingredient.includes("Tonalin")) return "토날린";
  if (ingredient.includes("Xylitol")) return "자일리톨";
  if (ingredient.includes("감마리놀렌산")) return "감마리놀레산";
  if (ingredient.includes("과라나추출물")) return "과라나추출물";
  if (ingredient.includes("구아이페네신")) return "구아이페네신";
  if (ingredient.includes("나토키나아제")) return "나토키나아제";
  if (ingredient.includes("달맞이꽃오일")) return "달맞이꽃오일";
  if (ingredient.includes("로즈힙추출물")) return "로즈힙추출물";
  if (ingredient.includes("루테인추출물")) return "루테인추출물";
  if (ingredient.includes("마늘오일농축")) return "마늘오일농축";
  if (ingredient.includes("면역글로불린")) return "면역글로블린";
  if (ingredient.includes("미오이노시톨")) return "미오이노시톨";
  if (ingredient.includes("민들레추출물")) return "민들레추출물";
  if (ingredient.includes("버드나무껍질")) return "버드나무껍질추출물";
  if (ingredient.includes("베타인염산염")) return "베타인염산염";
  if (ingredient.includes("베타인HCI")) return "베타인염산염";
  if (ingredient.includes("베타인HCl")) return "베타인염산염";
  if (ingredient.includes("베테인HCI")) return "베테인염산염";
  if (ingredient.includes("블레스드씨슬")) return "블레스트씨슬";
  if (ingredient.includes("빌베리추출물")) return "빌베리추출물";
  if (ingredient.includes("소팔메토가루")) return "소팔메토가루";
  if (ingredient.includes("시계꽃추출물")) return "시계꽃추출물";
  if (ingredient.includes("시너지혼합물")) return "시너지혼합물";
  if (ingredient.includes("아이브라이트")) return "아이브라이트추출물";
  if (ingredient.includes("옐로우재스민")) return "옐로우재스민";
  if (ingredient.includes("오미자추출물")) return "오미자추출물";
  if (ingredient.includes("이노시톨분말")) return "이노시톨분말";
  if (ingredient.includes("칼슘탄산칼슘")) return "칼슘탄산칼슘";
  if (ingredient.includes("커큐미노이드")) return "커큐미노이드";
  if (ingredient.includes("토마토추출물")) return "토마토추출물";
  if (ingredient.includes("트리뷸러스테")) return "트리블러스테레스트리스";
  if (ingredient.includes("프로테아제I")) return "프로테아제I";
  if (ingredient.includes("BioPQQ")) return "바이오PQQ";
  if (ingredient.includes("Biotin")) return "비오틴";
  if (ingredient.includes("Copper")) return "구리";
  if (ingredient.includes("EPADHA")) return "오메가3";
  if (ingredient.includes("EpiCor")) return "에피코르";
  if (ingredient.includes("Folate")) return "엽산";
  if (ingredient.includes("Ginger")) return "생강";
  if (ingredient.includes("Iodine")) return "요오드";
  if (ingredient.includes("Lutein")) return "루테인";
  if (ingredient.includes("Lysine")) return "리신";
  if (ingredient.includes("MCTOil")) return "MCTOil";
  if (ingredient.includes("Niacin")) return "나이아신";
  if (ingredient.includes("Papain")) return "파파인";
  if (ingredient.includes("RoseOx")) return "로즈옥스";
  if (ingredient.includes("Serine")) return "세린";
  if (ingredient.includes("Sodium")) return "나트륨";
  if (ingredient.includes("Valine")) return "발린";
  if (ingredient.includes("가시오갈피")) return "가시오갈피";
  if (ingredient.includes("가용성섬유")) return "가용성섬유";
  if (ingredient.includes("글루코만난")) return "글루코만난";
  if (ingredient.includes("글루코사민")) return "글루코사민";
  if (ingredient.includes("글루타치온")) return "글루타치온";
  if (ingredient.includes("글루타티온")) return "글루타치온";
  if (ingredient.includes("낫또추출물")) return "낫또추출물";
  if (ingredient.includes("루틴추출물")) return "루틴추출물";
  if (ingredient.includes("루틴파우더")) return "루틴분말";
  if (ingredient.includes("리놀레익산")) return "리놀레산";
  if (ingredient.includes("리보플라빈")) return "리보플라빈";
  if (ingredient.includes("마늘추출물")) return "마늘추출물";
  if (ingredient.includes("민들레뿌리")) return "민들레뿌리";
  if (ingredient.includes("브로메라인")) return "브로멜라인";
  if (ingredient.includes("비타민B6")) return "비타민B6";
  if (ingredient.includes("비타민D2")) return "비타민D2";
  if (ingredient.includes("비타민D3")) return "비타민D3";
  if (ingredient.includes("비타민K1")) return "비타민K1";
  if (ingredient.includes("비타민K2")) return "비타민K2";
  if (ingredient.includes("산사나무잎")) return "산사나무잎";
  if (ingredient.includes("생강추출물")) return "생강추출물";
  if (ingredient.includes("악마의발톱")) return "악마의발톱";
  if (ingredient.includes("일페카쿠안")) return "일페카쿠안";
  if (ingredient.includes("채소혼합물")) return "과채혼합물";
  if (ingredient.includes("판크레아틴")) return "판크레아틴";
  if (ingredient.includes("프로테아제")) return "프로테아제";
  if (ingredient.includes("프로폴리스")) return "프로폴리스추출물";
  if (ingredient.includes("호밀꽃가루")) return "호밀꽃가루추출물";
  if (ingredient.includes("하이알루론산")) return "히알루론산";
  if (ingredient.includes("Boron")) return "붕소";
  if (ingredient.includes("CoQ10")) return "코엔자임Q10";
  if (ingredient.includes("L이소루신")) return "L이소류신";
  if (ingredient.includes("MCT오일")) return "엠시티 영화관";
  if (ingredient.includes("Olive")) return "올리브";
  if (ingredient.includes("Potas")) return "포타스";
  if (ingredient.includes("VitB6")) return "비타민B6";
  if (ingredient.includes("감초뿌리")) return "감초뿌리추출물";
  if (ingredient.includes("계피껍질")) return "계피껍질";
  if (ingredient.includes("고투콜라")) return "고투콜라추출물";
  if (ingredient.includes("글루탐산")) return "글루탐산";
  if (ingredient.includes("락타아제")) return "락타아제";
  if (ingredient.includes("로열젤리")) return "로얄젤리";
  if (ingredient.includes("루틴분말")) return "루틴분말";
  if (ingredient.includes("리놀렌산")) return "리놀레산";
  if (ingredient.includes("리파아제")) return "리파아제";
  if (ingredient.includes("마그네슘")) return "마그네슘";
  if (ingredient.includes("마스네슘")) return "마그네슘";
  if (ingredient.includes("마크네슘")) return "마그네슘";
  if (ingredient.includes("망가니즈")) return "망간";
  if (ingredient.includes("베르베린")) return "베르베린";
  if (ingredient.includes("보스웰산")) return "보스웰산";
  if (ingredient.includes("비타민c")) return "비타민C";
  if (ingredient.includes("비타민D")) return "비타민D";
  if (ingredient.includes("비타민E")) return "비타민E";
  if (ingredient.includes("비타민K")) return "비타민K";
  if (ingredient.includes("생강분말")) return "생강분말";
  if (ingredient.includes("생강뿌리")) return "생강뿌리";
  if (ingredient.includes("생강오일")) return "생강오일";
  if (ingredient.includes("소팔메토")) return "소팔메토추출물";
  if (ingredient.includes("실리마린")) return "실리마린";
  if (ingredient.includes("오메가3")) return "오메가3";
  if (ingredient.includes("오메가3")) return "오메가3";
  if (ingredient.includes("오메가6")) return "오메가6";
  if (ingredient.includes("오메가9")) return "오메가9";
  if (ingredient.includes("이노시톨")) return "이노시톨";
  if (ingredient.includes("카모마일")) return "카모마일";
  if (ingredient.includes("폴리페놀")) return "폴리페놀";
  if (ingredient.includes("홉추출물")) return "홉추출물";
  if (ingredient.includes("GABA")) return "가바";
  if (ingredient.includes("Iron")) return "철";
  if (ingredient.includes("Kelp")) return "다시마";
  if (ingredient.includes("Maca")) return "마카";
  if (ingredient.includes("Vit디")) return "비타민D";
  if (ingredient.includes("Zinc")) return "아연";
  if (ingredient.includes("가엽수")) return "가엽수추출물";
  if (ingredient.includes("금잔화")) return "금잔화꽃추출물";
  if (ingredient.includes("레몬밤")) return "레몬밤";
  if (ingredient.includes("루테인")) return "루테인";
  if (ingredient.includes("멀베리")) return "멀베리추출물";
  if (ingredient.includes("면역력")) return "면역력증진혼합물";
  if (ingredient.includes("민들레")) return "민들레";
  if (ingredient.includes("빌베리")) return "빌베리농축물";
  if (ingredient.includes("크로뮴")) return "크로뮴";
  if (ingredient.includes("톱야자")) return "톱야자";
  if (ingredient.includes("파파인")) return "파파인";
  if (ingredient.includes("할미꽃")) return "할미꽃추출물";
  if (ingredient.includes("DHA")) return "오메가3-DHA";
  if (ingredient.includes("EPA")) return "오메가3-EPA";
  if (ingredient.includes("PGX")) return "PGX";
  if (ingredient.includes("PQQ")) return "PQQ";
  if (ingredient.includes("감초")) return "감초추출물";
  if (ingredient.includes("루틴")) return "루틴";
  if (ingredient.includes("마늘")) return "마늘";
  if (ingredient.includes("생강")) return "생강추출물";
  if (ingredient.includes("아연")) return "아연";
  if (ingredient.includes("토근")) return "토근";
  // 정규식처리
  ingredient = ingredient
    .replace(/표준화된/g, "")
    .replace(/표준화/g, "")
    .replace(/표준/g, "")
    .replace(/고유/g, "")
    .replace(/첨가/g, "")
    .replace(/(^총)/, "")
    .replace(/(^l)/, "L");
  // 기준단어 먼저 로직
  // "표준화된","표준화","표준", "고유", 첫자 "총","첨가" 문자제거
  // 첫자 l은 대문자L로 바꾸기
  // 첫문자숫자,"kg","lb","1회","함유","어린이","유아"는 포함되면 성분삭제"
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(ingredient[0])) return "";
  if (ingredient.includes("kg")) return "";
  if (ingredient.includes("lb")) return "";
  if (ingredient.includes("1회")) return "";
  if (ingredient.includes("함유")) return "";
  if (ingredient.includes("어린이")) return "";
  if (ingredient.includes("유아")) return "";
  // 불필요한 성분 삭제
  if (
    [
      "고도불포화지방",
      "블렌드",
      "섬유소혼합물",
      "진정혼합물",
      "혼합물",
      "규격",
      "극소량의미네랄농축물",
      "기타성분",
      "기타지방산",
      "깨끗함",
      "낮은GI",
      "다당류",
      "단일불포화지방",
      "당류",
      "도달범위",
      "독점블렌드",
      "독특한블렌드",
      "면역계지원혼합물",
      "물용량",
      "보호조직반응혼합물",
      "본질적인",
      "부산",
      "불포화지방",
      "뷰티블렌드",
      "상승적인혼합물",
      "색상",
      "설탕",
      "설탕알코올",
      "설탕알콜",
      "섬유소",
      "섬유소소화혼합물",
      "성인및12세이상어린이",
      "수증기모드",
      "오메가369오일혼합물",
      "오메가3피쉬오일",
      "오메가3피쉬오일농축물",
      "오메가7지방산",
      "유효성분",
      "잡지",
      "전압",
      "전원",
      "정격출력",
      "주석",
      "지방산및스테롤",
      "지방소화효소",
      "지방에서칼로리",
      "지방의칼로리",
      "지방칼로리",
      "지중해식식습관",
      "지중해식식습관연어",
      "당류",
      "오메가57및8지방산",
      "오메가5지방산",
      "오메가7지방산",
      "지방",
      "칼로리",
      "탄수화물",
      "칼로리",
      "크기",
      "트랜스지방",
      "특징",
      "포화지방",
      "필수",
      "활성효소",
      "B12",
      "Calories",
      "DrQuercetin",
      "II형가수분해콜라겐",
      "Invertase",
      "IP6",
      "LA",
      "nbsp",
      "nbspnbsp",
      "SAMe",
      "SAME",
      "TotalCarb",
      "TotalFat",
      "TotalSugars",
      "TransFat",
      "아에신20으로",
      "UCII닭연골",
    ].includes(ingredient)
  )
    return "";
  // 정규식처리
  return ingredient;
};

const getExpceptionRankCategory = (rank: string) => {
  return [
    "식료품",
    "베이킹재료",
    "아몬드가루",
    "바디케어",
    "바디마사지오일",
    "피마자",
    "따뜻한시리얼",
    "귀리오트밀",
    "시리얼아침식사",
    "세럼",
    "트리트먼트세럼",
    "치약",
    "미백용치약",
    "무불소치약",
    "구강케어",
    "헤어두피케어",
    "생활용품",
    "페이스오일",
    "아보카도마사지오일",
    "클로브오일",
    "균형",
    "휴식",
    "단일오일",
    "라벤더오일",
    "페퍼민트오일",
    "에너지증진기분향상",
    "시더우드오일",
    "정화클렌징",
    "바질오일",
    "베르가못오일",
    "시나몬카시아오일",
    "클라리세이지오일",
    "시트로넬라오일",
    "제라늄오일",
    "유칼립투스오일",
    "자스민오일",
    "로맨스",
    "레몬오일",
    "라임오일",
    "주니퍼베리오일",
    "생강오일",
    "균형오일블렌드",
    "휴식블렌드",
    "혼합오일",
    "자몽오일",
    "몰약오일",
    "에너지증진기분향상오일블렌드",
    "장미오일",
    "로맨스오일블렌드",
    "로즈메리오일",
    "넛맥오일",
    "솔잎오일",
    "오렌지오일",
    "오레가노오일아로마테라피",
    "정화클렌징오일블렌드",
    "파촐리오일",
    "네롤리오일",
    "마조람오일",
    "일랑일랑오일",
    "명상",
    "티트리오일",
    "세이지오일",
    "로션",
    "크릴오일",
    "구강청결제",
    "초콜릿음료",
    "캐스터오일",
    "팝콘",
    "스낵",
    "샌달우드오일",
    "클리너",
    "마누카꿀뷰티",
    "페이스워시클렌저",
    "클렌징토너스크럽",
    "라이스뷰티",
    "각질관리스크럽",
    "토너",
    "유아동용치약젤",
    "치발기구강케어",
    "캐슈넛",
    "위식도역류증상완화제",
    "꿀벌꽃가루",
    "루이보스티",
    "목련나무껍질",
    "아르간오일",
    "페퍼민트티",
    "쉐이빙크림",
    "면도제모",
    "골든베리",
    "오일세럼",
    "헤어스타일링",
    "디퓨저액세서리",
    "반려동물비타민미네랄",
    "반려동물보충제",
    "반려동물",
    "반려동물오메가오일",
    "반려동물허브제품",
    "에센셜오일스프레이",
    "파우더세팅스프레이",
    "수염관리",
    "면도수염관리",
    "남성용그루밍",
    "반려동물벼룩진드기제거제",
    "반려동물건강제품",
    "여드름잡티",
    "안면보호마스크",
    "개인위생용품",
    "성분별뷰티제품",
    "뷰티",
    "페이스마스크팩필링",
    "님",
  ].includes(rank);
};

const isYagiIngredientRank = (ingredient: string) => {
  //제품많은순 TOP 200개 성분
  return [
    "칼슘",
    "나트륨",
    "비타민C",
    "단백질",
    "식이섬유",
    "칼륨",
    "마그네슘",
    "콜레스테롤",
    "비타민D",
    "아연",
    "비타민B12",
    "철분",
    "비타민B6",
    "비타민E",
    "엽산",
    "비타민A",
    "리보플라빈",
    "비오틴",
    "판토텐산",
    "티아민",
    "비타민D3",
    "니아신",
    "셀레늄",
    "망간",
    "요오드",
    "구리",
    "크로뮴",
    "몰리브덴",
    "비타민K",
    "이노시톨",
    "글루탐산",
    "루테인",
    "콜린",
    "코엔자임Q10",
    "오메가3",
    "L라이신",
    "L류신",
    "L티로신",
    "글라이신",
    "L트립토판",
    "L발린",
    "인",
    "L메티오닌",
    "L페닐알라닌",
    "L히스티딘",
    "L프롤린",
    "L알라닌",
    "L세린",
    "L아르기닌",
    "L시스테인",
    "L트레오닌",
    "비타민K2",
    "L아스파르트산",
    "아스파르트산",
    "도코사헥사엔산",
    "L아이소류신",
    "히스티딘",
    "보론",
    "과채혼합물",
    "알파리포산",
    "프로테아제",
    "라이코펜",
    "아르기닌",
    "류신",
    "프롤린",
    "세린",
    "에이코사펜타엔산",
    "오메가3-DHA",
    "알라닌",
    "나이아신",
    "메티오닌",
    "발린",
    "글루코사민",
    "브로멜라인",
    "피쉬오일농축물",
    "오메가3-EPA",
    "트레오닌",
    "붕소",
    "루틴",
    "페닐알라닌",
    "트립토판",
    "티로신",
    "라이신",
    "글리신",
    "아이소류신",
    "L글루타민",
    "베타인염산염",
    "바나듐",
    "리놀레산",
    "히알루론산",
    "수용성섬유소",
    "철",
    "타우린",
    "시스틴",
    "L글라이신",
    "오메가6",
    "징크",
    "L이소류신",
    "퀘르세틴",
    "가시오갈피",
    "포도씨추출물",
    "자일리톨",
    "생강추출물",
    "밀크시슬추출물",
    "로즈힙",
    "오메가9",
    "아밀라아제",
    "바이오틴",
    "폴리페놀",
    "글루타치온",
    "L카르니틴",
    "크롬",
    "셀룰라아제",
    "필수아미노산",
    "달맞이꽃오일",
    "불용성섬유소",
    "포타슘",
    "리파아제",
    "파파인",
    "녹차추출물",
    "감마리놀레산",
    "효소혼합물",
    "L테아닌",
    "프로바이오틱혼합물",
    "가수분해콜라겐",
    "락타아제",
    "중쇄중성지방",
    "면역글로블린",
    "피쉬오일",
    "아스타잔틴",
    "혼합토코페롤",
    "강황추출물",
    "시스테인",
    "프로바이오틱배양균",
    "메틸설포닐메탄",
    "베타락토글로불린",
    "커큐미노이드",
    "포스파티딜세린",
    "루틴추출물",
    "제아잔틴",
    "비타민B1",
    "크랜베리",
    "감초추출물",
    "글루코사민설페이트",
    "황산콘드로이틴",
    "비타민B3",
    "베르베린",
    "L쓰레오닌",
    "보스웰리아추출물",
    "당알코올",
    "레몬밤",
    "스테비아잎분말",
    "글루코아밀라아제",
    "락토바실러스람노서스",
    "염화물",
    "면역력증진혼합물",
    "비타민K1",
    "트랜스레스베라트롤",
    "가바",
    "글루코사민황산염",
    "당",
    "락토페린",
    "이소류신",
    "글리코매크로펩타이드",
    "비타민B2",
    "무수베타인",
    "아슈와간다추출물",
    "판크레아틴",
    "올레산",
    "리코펜",
    "민들레",
    "포스파티딜콜린",
    "클로라이드",
    "유기농아마씨오일",
    "베타글루칸",
    "카프릴산",
    "칼슘탄산칼슘",
    "은행나무추출물",
    "호박씨오일",
    "실리카",
    "펩신",
    "비피도박테리움비피덤",
    "락토바실러스플란타럼",
    "수용성식이섬유",
    "유비퀴놀",
    "알지닌",
    "홍경천추출물",
    "빌베리추출물",
    "생강뿌리",
    "쏘팔메토추출물",
    "블랙엘더",
    "알파락트알부민",
    "헤스페리딘",
    "비피도박테리움브레브",
    "L알지닌",
    "보리지오일",
    "아세틸L카르니틴",
    "강황뿌리추출물",
    "루틴분말",
  ].includes(ingredient);
};
