import axios from "axios";
import { load } from "cheerio";
import request from "request";
import { l } from "../console";
import { headers } from "./headers";
import { productURLDataType, IherbType } from "./updateByIherb";

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
          if (text.includes("서빙 당")) return;

          const titleTemp = div.find("td:nth-child(1) > strong").html() || div.find("td:nth-child(1)").html() || "";
          const title =
            titleTemp
              .slice(0, titleTemp.indexOf("(") === -1 ? titleTemp.length : titleTemp.indexOf("("))
              .slice(0, titleTemp.indexOf("<br>") === -1 ? titleTemp.length : titleTemp.indexOf("<br>"))
              .replace(/<p>/g, "")
              .replace(/<span>/g, "")
              .replace(/:/g, "")
              .replace(/<\/span>/g, "")
              .replace(/<br>/g, "")
              .replace(/†/g, "")
              .replace(/ /g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          const amount =
            div
              .find("td:nth-child(2)")
              .text()
              .replace(/†/g, "")
              .replace(/<br>/g, "")
              .replace(/ /g, "")
              .replace(/,/g, "")
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

          if (
            !title ||
            title === "<br>" ||
            title === "&nbsp;" ||
            title.includes("*") ||
            title.includes("제공량") ||
            title.length > 30
          )
            return;
          if (amount && title) {
            ingredientList.push(title);
            ingredientAmount += title + " : " + amount + "\n";
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
          ingredient_amount: ingredientAmount,
          ingredient_raw: ingredientRaw,
          ingredient_count: ingredientCount,
          rating: rating,
          review_count: reviewCount,
          review_url: reviewUrl,
          list_url: urlData.list_url,
          product_url: urlData.product_url,
          primary_ingredients: ingredientList.slice(0, 10).join(", "),
          func_content: null, //rankStrList.slice(0, 10).join(", "),
        };

        if (reviewCount === "https://kr") {
          l("ERR Data", "red", "iherb.reviewCount 데이터가 잘못되었습니다.");
          return resolve(null);
        }
        if (iherbProductName === null) {
          l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다. iherbProductName = null");
          return resolve(null);
        }
        await axios
          // .post(`https://node2.yagiyagi.kr/crawling/product/iherb`, data)
          .post(`http://localhost:3001/crawling/product/iherb`, data)
          // https://node2.yagiyagi.kr
          .catch((d) => l("ERR Data", "red", "iherb 데이터 중 일부가 누락되었습니다."));
        return resolve(data);
      });
    } catch (error) {
      l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다. (1)" + error);
      return resolve(null);
    }
  });
};
