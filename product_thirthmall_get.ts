import axios from "axios";
import { load } from "cheerio";
import fs from "fs";
import path from "path";

export type ThirthMallProductType = {
  imageUrl: string;
  productLink: string;
  productName: string;
  discountRate: number;
  price: number;
  reviewCount: number;
  deliveryFee: number;
};

//TODO accesstoken 로그인해서 넣어서 price:0 인것 없는지 체크하기
// ㄴ 파라미터 따로 있음 item_link > button.btn_basket_get > data-goods-price attr에 있음
const getMallData = async (url: string) => {
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

async function fetchPageData(urlList: string[]) {
  const productList: ThirthMallProductType[] = [];
  console.info(`Start fetching product list`, new Date().toISOString());
  for (let i = 0; i < urlList.length; i++) {
    const list = await getMallData(urlList[i]);
    if (list) productList.push(...list);
    console.info(
      `[${i + 1}/${urlList.length}] Complete fetching product list - product length ${productList.length}`,
      new Date().toISOString()
    );
  }
  console.info(`End fetching product list`, new Date().toISOString());
  // 결과를 파일에 쓴다.
  const formattedData = productList.map((p) => JSON.stringify(p, null, 2)).join("\n");
  const outputPath = path.join(__dirname, "log/thirtymall_output.log");
  fs.writeFileSync(outputPath, formattedData, "utf8");
  console.info(`Data written to ${outputPath}`);
}
const urlList = [
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=1",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=2",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=3",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=4",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=5",
  "https://www.thirtymall.com/goods/goods_list.php?cateCd=004&sort=g.regDt+desc&pageNum=1000&page=6",
];
fetchPageData(urlList);
