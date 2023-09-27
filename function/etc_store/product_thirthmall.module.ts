import axios from "axios";
import { load } from "cheerio";
import { NODE_API_URL } from "../common";

export type ThirthMallProductType = {
  imageUrl: string;
  productLink: string;
  productName: string;
  discountRate: number;
  price: number;
  reviewCount: number;
  deliveryFee: number;
};

export const getStoreData = async (url: string) => {
  try {
    const response = await axios.get(url, { headers: { "Accept-Encoding": "deflate, br" } });
    if (!response) return;
    const html = response.data;
    const $ = load(html);
    const list: ThirthMallProductType[] = [];

    $(".goods_list_item > .goods_list > .goods_list_cont > .item_basket_type > ul > li").each((index, element) => {
      // 상품 상세페이지 링크
      const productLink = $(element)
        .find(".item_photo_box a")
        .attr("href")
        ?.replace("..", "https://www.thirtymall.com");
      const imageUrl = $(element).find("div.item_photo_box").attr("data-image-main"); // 상품 이미지 URL
      const productName = $(element).find(".item_name").text().trim(); // 상품명
      const discountRate = Number(
        $(element).find("div[style*='color:#ff3912'] strong").text().trim().replace(/[^\d]/g, "")
      ); // 할인율
      const price = Number($(element).find("button.btn_basket_get").attr("data-goods-price")); // 가격
      // const price = Number($(element).find(".item_price strong").text().trim().replace(/[^\d]/g, "")); // 가격
      // 배달료
      const deliveryFee =
        $(element)
          .find("div > div.info_wrap > div.item_info_cont > div.item_tit_box > div:nth-child(5) > span")
          .text()
          .trim() == "업체무료배송"
          ? 0
          : 2500;
      // 리뷰 수
      const reviewCount = Number(
        $(element).find(".item_info_goodsPt .star_shape span").text().trim().replace(/[^\d]/g, "")
      );
      // 유통기한
      // const expirationDate = $(element).find(".dn.btn2.tuSalesEndType0").text().trim().replace("유통기한 ", "");
      // 소비기한
      // const expiryDate = $(element)
      //   .find(".item_tit_box > .item_info_renewal > .btn2.tuSalesEndType1")
      //   .text()
      //   .trim()
      //   .replace("소비기한 ", "");
      //배송정보 - ex) 9/22(금) 09시 co
      // const deliveryRaw = $(element).find(".grade_star .star_rcnt").text().trim();
      // const deliveryInfo = deliveryRaw.split("\n")[0];
      if (imageUrl && productLink)
        list.push({ imageUrl, productLink, productName, discountRate, price, reviewCount, deliveryFee });
    });
    return list;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

type resType = {
  require_keyword: string; // "퍼펙토|PERFECTO";
  exception_keyword: string; //"";
  yagi_product_id: number; //92150;
};

const filteredProducts = (productList: ThirthMallProductType[], requireKeyword: string, exceptionKeyword: string) => {
  const includesPattern = (str: string, words: string[]) => words.every((word) => str.includes(word));
  const excludesPattern = (str: string, words: string[]) => !words.some((word) => str.includes(word));
  requireKeyword = requireKeyword.replace(/\s+/g, "");
  const rkList = requireKeyword.includes(",") ? requireKeyword.split(",") : [];
  exceptionKeyword = exceptionKeyword.replace(/\s+/g, "");
  const ekList = exceptionKeyword.includes(",") ? exceptionKeyword.split(",") : [];
  return productList.filter((p) => includesPattern(p.productName, rkList) && excludesPattern(p.productName, ekList));
};

export const saveProductList = async (productList: ThirthMallProductType[]) => {
  let result_count = 0;

  const keywordList = await axios
    .get(`${NODE_API_URL}/crawling/product/keyword`)
    .then((d) => d.data.data as resType[])
    .catch(() => [] as resType[]);

  console.info("야기야기의 북마크되어있고 필수키워드 있는 제품갯수", keywordList.length);

  const result: { [pid: number]: ThirthMallProductType[] } = {};
  for (let i = 0; i < keywordList.length; i++) {
    const { require_keyword: rk, exception_keyword: ek, yagi_product_id: pid } = keywordList[i];
    const filteredList = filteredProducts(productList, rk, ek);
    if (filteredList.length > 0 && filteredList.length < 5) {
      result_count++;
      // console.info("매칭수:", filteredList.length, "rk:", rk || "null", "ek:", ek || "null", "pid:", pid);
      result[pid] = filteredList;
    }
  }

  console.info("야기야기와 떠리몰 제품 매칭 수:", result_count);

  const res = await axios.post(`${NODE_API_URL}/crawling/product/etc_store/list`, {
    store_domain: "thirtymall.com",
    list: result,
  });
  console.info(res.data.data === true ? "성공" : "실패");
};
