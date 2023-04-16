import axios from "axios";
import { load } from "cheerio";
import request from "request";
import { l } from "./console";
import { productURLDataType } from "../iherb_update";
import { IherbProductPriceType, ProductType } from "./iherb/updateByIherb";

// # (1)가격은 getProductPriceData 사용해서 가져오고(REST API 사용),
// # (2)제품의 상세 데이터는 getProductDescData를 통해 가져옴(페이지 크롤링)
// (2)는 iherb 데이터를 크롤링 봇으로 판단해 IP 막으므로 수동체크 반드시 필요. -> 주기적으로 돌리는 자동화 불가능
export const getProductPriceData = (urlData: productURLDataType): Promise<IherbType | null> => {
  return new Promise(async (resolve, reject) => {
    const iherbProductId = urlData.product_url.slice(
      urlData.product_url.lastIndexOf("/") + 1,
      urlData.product_url.length
    );
    const res1 = await axios
      .get(
        `https://catalog.app.iherb.com/recommendations/freqpurchasedtogether?productId=${iherbProductId}&pageSize=2&page=1&_=1681620224467`,
        headers()
      )
      .then((d) => {
        if (d.data.errorType === undefined) return d.data as IherbProductPriceType;
        l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(3)");
        return null;
      })
      .catch((e) => (l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(4)" + e), resolve(null)));

    const res2 = await axios
      .get(`https://kr.iherb.com/ugc/api/product/v2/${iherbProductId}`, headers())
      .then((d) => {
        if (d.data.errorType === undefined) return d.data as ProductType;
        axios.delete(``);
        l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(3)"); // >> 안팔면 판매처 삭제필요함 가격/판매처 데이터 지우고 is_stock 1로 표시
        return null;
      })
      .catch((e) => (l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(6)" + e), null));

    console.log({ res1 }, { res2 });
    if (!res1 || !res2) return l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.(7)"), null;

    const data = {
      iherb_product_id: iherbProductId,
      // iherb_product_name: res1.originProduct.name,
      //  iherb_product_brand: urlData.brand,
      //  iherb_product_image: iherbProductImage,
      is_stock: res2.isAvailableToPurchase ? "1" : "0",
      is_super_sale: res1.originProduct.discountType === 7 ? "1" : "0",
      discount_type: res1.originProduct.discountType,
      price: res1.originProduct.discountedPriceAmount,
      // rank: rankListString,
      // is_delivery_event: isDeliveryEvent ? "1" : "0",
      delivery_price: res1.originProduct.discountedPriceAmount > 40000 ? "0" : null, //가격이 4만원넘으면 무료배송
      // description: description,
      // description_use: descriptionUse,
      // description_other_ingredient: descriptionOtherIngredient,
      // description_warn: descriptionWarn,
      // ingredient_amount: ingredientAmount,
      // ingredient_raw: ingredientRaw,
      // ingredient_count: ingredientCount,
      rating: res1.originProduct.rating,
      review_count: res1.originProduct.ratingCount,
      review_url: res1.originProduct.reviewUrl,
      list_url: urlData.list_url,
      product_url: res1.originProduct.url,
    };
    axios.post(``); //가격과 판매처 daily_price에 저장함.
    // console.log(res);
  });
};

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
        // # 아이허브 슈퍼할인 여부 가져오기
        const isSuperSale = $(".flag-Special > bdi").text().includes("슈퍼 세일!");
        // # 아이허브 가격
        const price =
          $("div.price-container > b").html()?.trim().replace(/[₩,]/gi, "") ||
          $(".price-inner-text > p").html()?.trim().replace(/[₩,]/gi, "") ||
          null; //가격(원 기준)
        // # 아이허브 랭킹 가져오기
        const rankList: string[] = [];
        $(".best-selling-rank > div").each((i, e) => {
          const textList = $(e).find("strong").text().trim().split(" in");
          const rank = textList[0].replace(/[^0-9]/gi, "");
          const category = textList[1].replace(/[^ㄱ-ㅎ가-힣a-zA-Z0-9]/gi, "");
          rankList.push(rank + "위 : " + category);
        });
        const rankListString = rankList.join("\n");
        // # 아이허브 배송비 이벤트 여부
        const isDeliveryEvent = $(".free-shipping-text").text().trim().slice(0, 18) === "₩40,000 이상 주문 시 무료"; //4만원 이상 주문시 무료배송 맞는지여부
        // # 아이허브 배송비 이벤트 체크 및 배송료 계산
        let delivery: number | null = null;
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

          const title =
            div
              .find("td:nth-child(1)")
              .text()
              .replace(/ /g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          let amount =
            div
              .find("td:nth-child(2)")
              .text()
              .replace(/ /g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          if (title === "칼로리" && amount) amount = amount.replace("명", "cal");
          const percent =
            div
              .find("td:nth-child(3)")
              .text()
              .replace(/ /g, "")
              .replace(/\([^)]+\)/gi, "") // 괄호삭제
              .trim() || null;

          if (title?.includes("*")) return;
          if (amount && title) ingredientAmount += title + " : " + amount + "\n";
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
          is_super_sale: isSuperSale ? "1" : "0",
          price: price,
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
        };

        if (reviewCount === "https://kr") {
          l("ERR Data", "red", "iherb.reviewCount 데이터가 잘못되었습니다.");
          return resolve(null);
        }
        if (iherbProductName === null) {
          l("ERR Data", "red", "iherb 데이터를 가져올 수 없습니다.");
          return resolve(null);
        }
        await axios
          .post(`https://node2.yagiyagi.kr/crawling/product/iherb`, data)
          // .post(`http://localhost:3001/crawling/product/iherb`, data)
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

type IherbType = {
  iherb_product_id: string;
  iherb_product_name: string | null;
  iherb_product_brand: string | null;
  iherb_product_image: string | null;
  is_stock: string;
  is_super_sale: string;
  price: string | null;
  rank: string;
  is_delivery_event: string;
  delivery_price: number | null;
  description: string;
  description_use: string | null;
  description_other_ingredient: string | null;
  description_warn: string | null;
  ingredient_amount: string;
  ingredient_raw: string;
  ingredient_count: string;
  rating: string | null;
  review_count: string | null;
  review_url: string | null;
  list_url: string;
  product_url: string;
};
export const getProductListData = (list_url: string): Promise<productURLDataType[]> => {
  return new Promise(async (resolve, reject) => {
    request(list_url, headers(), (error, _, body) => {
      if (error) {
        l("error request", "red", error);
        return reject([]);
      }
      const $ = load(body);
      const productDataList: productURLDataType[] = [];
      const brand = $("h1.sub-header-title").text().trim();
      $(".absolute-link-wrapper > a").each((i, e) => {
        const product_url = e.attribs["href"];
        productDataList.push({ list_url, product_url, brand });
      });

      return resolve(productDataList);
    });
  });
};

export const getMaxPageList = (list_url: string): Promise<{ maxPage: number | null; list_url: string }> => {
  return new Promise(async (resolve, reject) => {
    request(list_url, headers(), (error, _, body) => {
      if (error) {
        l("error request", "red", error);
        return reject({ maxPage: null, list_url });
      }
      const $ = load(body);
      const a = $("#product-count").html();
      const allCount = Number(a?.slice(0, 5).replace(/[^0-9]/gi, "")); //10770
      const maxPage = Math.ceil(allCount / 48);

      return resolve({ maxPage, list_url });
    });
  });
};
let i = 0;
const headers = () => {
  const cookieList = [
    "_px3=b05a7cf8df6fc511a852624fe4b61372434a4f56b42e9ed47758d98b7011a8b4:P2jAudVRqz4cpTG+vFq71uiGPoIcOWm+0ylImB1C/qpcrnmPloT+SJXsBaURoSjGVccdptjpvNEDfpQ66k812Q==:1000:Zys0TjksM7KjnA1uB/P48BIQAQDgID2Mu3AXmmqTYF7aEtD3ez/QLIK1hG6hym1FCofeD/QA4v97jJOWYjcMM915226w7J+TJKVZRmsu7IyQdbReTOKYuLOwiiPscyRS4jrYLjNooukih8/3XQtd41l1ACssQqfmoFuWtoZbwJJOVpeCjhhaHUJV5JGBy8Ha8TnmtLloQwaDywFuilcZAQ==",
    "_px3=a76e2828f89c009d3121ead2f31db9359b1a549f1e2857d8af12f03e4d717184:25YDTU8HJsCm0ZurGnaVq5jHoTQI0Cy+StbM46BNLVlA1zBWP5A829k950HOT4ZQww7EjK3dUgnuch0vSSQsGQ==:1000:4C6jx2KsmbcIBxlCAKHJOh31gMX70uuedgNuA1Jktb8CFEaVIi++b9c9JueU1AkmJrDr2KyuAXlFzWGYuMLjeGWyft8EqzDQYOUO8sFYAVqqZDs9ysoRY2Voa4vDrDi30i9ubk1wQkvDYK2/lGepWN98XXEdVA/fqJleT8MfQJyyfzUVi7ggFJ8M64PV9/8gCbXOhMXG3gL6i6Puj6Ts8w==",
    "_px3=bee26a22068a042f7204cb20a17f44b988fc690b99ca6256cdd4d902996b4a8f:YesFGsNCecLMc55Ke64kA2iCoUBM7WqCeRHGET97GfKpU9z+0W0FBwn38AsfZsMiGpYrjy7iC0RLUkXLKBy5Xg==:1000:EjMe7opXlCVZa9Mv3Y3eb1B3atNGEsD7m72FRSZVS1q8GxThDmtGllvNhTLw/F6JTLBN4Io5geoxXuEodTPci0W0+sZ0A7/ZpTupIz0i5y/U/PawN5Ql/sgYAnqhcj4MlfoSSbVRWK8NU2YvM9snJC3R1pFIH6AY6NJTYMiFapX5ARW7EXD4SDw1F2bT3QvUS14FQFsfFbyeXhc/GNlWKA==",
    "_px3=d50bc1e333f68cf74d44496ccb383df9bc95bf8982136871128071afdad1bf6d:xv7DKAJo8hSCQZlftr8RCAbXJs96SB9SbVhGVJ6oMQCTNxdPxJ/5tguwhfuGryiJOdyxulSpGNBleMwUoy1CdA==:1000:eK+ahCw9H5F35cP3ZjVm6Ld3U338kOZLpVvoagXvIXEpQJfqxWUMofeQFSTFQ3a6crJCoqIWd6XPaU6F0238fv4ZuCezQvQ7yeqc1VujVWyOJDY8kueXsqszk2F51HVNW0SvLLGFjiPIlZ89wGBkIY2nfJ7DHnRQVsyMeYNuXAwpO/AcA09Bk28/tF8DzHRqKZGZMOBZwJdlutEPr7IPfQ==",
    "_px3=a2d413bf596e0c1fb2a9d49acdf844317ebcd3a3a93445a821ac07fab7cfef87:pOOISX7WR4eS+E97ufcfRcuVu6CVnW1qskC6YyRqejIAEi3YmnC4hKMaXDl0cfU88CU4XHMcgohHadUv/gCySw==:1000:8lCG0crb5TZaBTH2rOnpUeQPVcJX8o49w/hZBQ1iRALv+K2Hcrwszg8D+U7Y111V4opR6NCxFvt4Zu2VVDhbVrxq33sDwYSXt1/1xRCJ/BUkpRnE1Y4RkALL85CG82J+030d6Z1ZuvkcCu5M+72AKGbIExYS4eOyhSXda60YAINvfn3O6z0YgErL4RWYIwWANg7PFq4q7qUeBrHmsHAZsg==",
    "_px3=3c0dca41b7f883c78d7f01f14082146c2fd8151f93dd51e16a5a7da933bedf2c:k9JLlVlihAqeMcoZ4ZGEzhcCzlHLL2ZK87gx+viY2Px2MuzvtpBkLTM1cyZiyU0ZAGGlLPSgVCZcfBIa3eTnLg==:1000:BY6kCfvxe/zYEhjIWnKYy6f9UAkt1JtpBxm1ofFtWBGzmxDCZjXHZcehZ/havvC5pWxNCmR6Xo8h/YiRAIaG0YfSVWWYUcoWfI98FhY7hoxaBon/BQcc/cUj4S6l5mcqemaqUlAtJFRDO4uQm5EDNXhVQHBqfG3+de3dUURtjzsRHwb01yvTY5F+vxgqf/EWtSd4OPDZbXHjkgzHjA7NOg==",
    "_px3=5b81e8f2a175b254081cd30b3dcd01c9e173c4d6cd1742801be656fda063de3b:VPJCwKoo4bAW4zeBYdlLCbhYtqmg0VpnoE2fiav6S8636D26DN8gGdgc2TrrOM1ahCGgKZ+Uu/N757zlkiYUVg==:1000:EvQxCfijZt55rhoOqMIlU/Afi7w4tTzfk/tOCxGzZaakwmR5k7S9on3iEI7oT/ZkrE+wMsX/SpneSfiq7W0cwtoydP3v12Lfb3au9mrnxHOAsC7fDrOFAaby1ABgtZrysJEGOEvo6J04wahOrW+RGLd8lI9yibuVbxjOho2y2zdzfisFLXJS8qfC30AsCboYyTp2Ked9dl+WOCvRSaP/2Q==",
    "_px3=2235ee228776ae9522dce7699ff01315bbd0e8d9c5b34b658caa5da7681c069c:1hn6yci1CjfFaW2tealIBTfIt3rlCG6zapD4t1MR3P/w4ZLw7beZeAQBehUfqh836IhXiu3U3AcO/bN6SdjJjg==:1000:C7NKxD+YDgmd3ZyzGn1C8Exmui9lC1b+SY8T0yED2zx7a/txrln6nNPevYZiWJcS0wp53s23tv8ntCq0BaUheakkuame1RlP++/R+7rIq2RDCF729RylMpDE9wCcrrBK+M689hhIPXSxaQCWpvlEvD+yatY2jSG++gh7YFzcMoYmSjqiuq332GB4UMQPV2Qw63RT24KMjgDmZd0ZOukocQ==",
    "_px3=b6cea71475f91dd5705a8add89c94aeaa97558e9ea0c6655ae24bf120cb8d8af:w2FSSkRe6z+fSchrqX6eJLsTcEMjBs1/XSmb9DzlFqVgUdSIvSFbYmKkPpPSvAyTjDURw1RO52LNlndNP0f5Kg==:1000:g2n3vnDTTKqojO0yGLODJ/h49QBBBjLeODcbvceFgCTqWhy6mCdIE7K4aIKR5QSeLKuuKch5zPia29yntL1fE2UGUo2SAKmIILmjpY57OD2khTGG7s9eJfgDaTGUmU4PhNMJtdTFWHN8k4fFDvxhCCKefYbUt+BTpBVR7Drc+WZmoFHoEBu9rSofnovOUZGH+Ghn9uka7g2H4pPCUQSO0Q==",
    "_px3=aab75bc82a8945ca05a89a5b7a1e81b6a7f0c7b7ee88dbc0da72dbec52886984:DvHkGwscwxfdkjXZb6t1rf8NPbOaAXmh+mmnpue7wu6aG6qGyNBWyK1nSd+/clnaGvxDs+KdK18O9cxO7/6KLA==:1000:GQlm30YDkqwDAV+lZWYhJ+0WW0LRa6zDnlO11VtpU4JwcmEegr+5hdikXUYA/Loeox7OZICmDkKtpOLoHt5sSFlmNaeJEm3Er2LiU4TvcKk9JF8ntO9BHA0f1rLA2YhgIBfuxPSFd4aZRDYwEfCI//BSGAAPnXKjJtXPGIqulIRfcFoyNpcMNKVaPIIbwv32O9mJy47Yj1EOpdvK4ilNSw==",
    "_px3=c0d382b6893538e020d9248099f96d23ff18e8554753251828fc2bae71d19114:v55KFHgEqSmMVZTKJVC49DjWx/L1KEW09ea750h9j2eTWBeCvWPiJpBPg/iEB0F/bRB3eoPuQI6snQdx+VSCYg==:1000:JdJYAu0s/N4R/AlMVsbnNl9LWg9dss2hWdhzMNdN2AnfTZqzIqQpa/qWOVH4YY79UHQR5qxizpaJfoKVCnjYGAOf14joTOxiNMDmlLgb+wC4zc9gMxxZLw5zoRlcurRkM8qM+jGClbFbo7rWVw59HFD5pVH9bYz0075mIEzckDUqvCF/tdj7720sC9X7fe/U807O1FsEfZ54yvk8fgi28A==",
    "_px3=1c3c8383bc64e682a66293de661e6e52f963eaf1bb54e48ed0f96009bffad2cd:r/iEI6s3ZKOrRIgrLkMv+47tg8tT0gLY1KcuSgel+lFj4flXHhtpS0L1k8FwQtnmJ0pmnFbeKmH/H67Qr2bGgw==:1000:wF75sELzM1UzTjcEQVmq9zeXE57uilianb7IqlCbOPZe3xiR8cIv1lzXlUwY95nRO7fRT8JTdp+I809Putpq8n5mb+7x/SohoU0xyR3tCjwRuB2Ud8KX6LggEIqdIN2TDsjIkxTFyzMb6afGwpQIhJ2BLp9s5mcECGSxJNMPKBxU6kmMd0Htgc/zTpsBGD65NL6buz/7hrSJ1g8rqA5LCg==",
    "_px3=247e49052a0590e5ddeed16b4cb5339b99c63f3664c686370f9c55df0a16d695:VCTPcRRltzsvNlQj7bVj4yrZlVcvtVgEnFwfvVocZNScRDB7n/ITqTPEbo8hNeMjgi0waxBVNnKSylEynZxBAw==:1000:2Qo2sG0P7am4kNlGYuvy2kd2TRhnqaeTnrxyDzSpGPj7ZLy0Gcvd6IV4uMgUk7qDCY8OVsbVjkHN5Ov3DfZOQ0mu6j/oAOgpT7XTAWsmnFlmbJAvY7sAtNY0x1jQNz76V34VCdkyuk/e2rdDBdclYOYIgKaMd1hiVADLk8267vqO8fJXoGNOXn4+a90PFLtt17GxJZF8XAHAo9lwnDkyfg==",
  ];
  const cookie = cookieList[i % cookieList.length];
  console.log("headers", i, cookieList.length, cookie.slice(0, 10));
  i++;
  return {
    headers: {
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      "Accept-Encoding": "deflate, br",
      "cache-control": "no-cache",
      Cookie: cookie,
    },
  };
};
