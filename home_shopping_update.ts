import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { NODE_API_URL } from "./function/common";
import { load } from "cheerio";
import dayjs from "dayjs";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

const getStoreData = async (data: getHomeShoppingListResponseType[0]): Promise<getHomeShoppingListResponseType[0]> => {
  const result = await axios.get(data.livehs_url).then((d) => d.data);
  const $ = load(result);
  const shop_thumnail_url = $('meta[property="og:image"]').attr("content") || null; // 썸네일 주소 가져오기

  // 제품상세이미지 URL 추출하기
  const str = result.match(/loadDescription\(\) \{[^}]*\}/);
  const detailFunctionString = str && str.length > 0 ? str[0] : "";
  const detailImageUrl = detailFunctionString.match(/http:\/\/cdn\.api\.livehomeshopping\.com\/[^"]+/)[0];
  // 해당 detailImageUrl로 요청하여 .img_detail > p > img의 src 가져오기
  const detailImageResponse = await axios.get(detailImageUrl);
  const detail$ = load(detailImageResponse.data);
  const shop_desc_image_url = detail$(".img_detail > p > img").attr("src") || data.shop_desc_image_url;

  const broadcastTime = $(".date")
    .text()
    .split("~")
    .map((time: string) => time.trim()); // 방송시작시간과 방송끝시간 가져오기
  const startText = broadcastTime[0]
    .replace("오늘 ", dayjs().format("MM월 DD일 "))
    .replace("내일 ", dayjs().add(1, "day").format("MM월 DD일 "))
    .split("방송시간")[1]
    .trim()
    .replace("월 ", "-")
    .replace("일 ", "T");
  const startTime = dayjs(dayjs().get("year") + "-" + startText);
  const start_at = startTime.format("YYYY-MM-DDTHH:mm:ss");

  const endHour = Number(broadcastTime[1].split(":")[0]);
  const endMin = Number(broadcastTime[1].split(":")[1]);
  const end_at = startTime.set("h", endHour).set("minute", endMin).format("YYYY-MM-DDTHH:mm:ss");

  const shop_product_name = $("div.product-detail > div.title").text(); // 제품 이름 가져오기
  const shop_price = Number($(".discount-price.price").text().replace(/,/g, "").replace("원", "").trim()); // 제품 판매가격 가져오기
  const shop_purchase_url = $(".buy").attr("href") || data.shop_purchase_url; // 구매링크 가져오기

  const className = $("i.sprite-site-logo").attr("class")?.split(" ")[1] || "";
  const shop_name = getStoreName(className);

  const video_url = $("video > source").attr("src") || getVideoURL(shop_name || "") || data.video_url; // m3u8 비디오 URL 가져오기
  return {
    ...data,
    is_crawling: 1,
    start_at,
    end_at,
    shop_desc_image_url,
    shop_price: Number(shop_price),
    shop_purchase_url,
    shop_product_name,
    shop_thumnail_url,
    video_url,
    shop_name,
  };
};

async function saveProductList(result_list: getHomeShoppingListResponseType) {
  await axios.post(`${NODE_API_URL}/crawling/shop`, { result_list });
  return;
}

async function fetchPageData() {
  const shopList = await axios
    .get(`${NODE_API_URL}/crawling/shop`)
    .then((d) => d.data.data as getHomeShoppingListResponseType);

  const resultList: getHomeShoppingListResponseType = [];
  console.info(`Start fetching shop list`, new Date().toISOString());
  for (let i = 0; i < shopList.length; i++) {
    const list = await getStoreData(shopList[i]);
    if (list) resultList.push(list);
    console.info(
      `[${i + 1}/${shopList.length}] Complete schedule_id:`,
      shopList[i].schedule_id,
      shopList[i].livehs_url,
      new Date().toISOString()
    );
  }
  console.info(`End fetching product list`, new Date().toISOString());
  saveProductList(resultList);
}

fetchPageData();

export type getHomeShoppingListResponseType = {
  schedule_id: number;
  livehs_url: string;
  is_crawling: 0 | 1;
  shop_thumnail_url: string | null;
  start_at: string | null;
  end_at: string | null;
  shop_desc_image_url: string | null;
  shop_price: number | null;
  shop_purchase_url: string | null;
  shop_product_name: string | null;
  video_url: string | null;
  shop_name: string | null;
}[];

const classNameToStoreName: {
  [key: string]: string;
} = {
  "sprite-logo-535773": "롯데홈쇼핑",
  "sprite-logo-535774": "CJ온스타일",
  "sprite-logo-535775": "GS SHOP",
  "sprite-logo-535776": "현대홈쇼핑",
  "sprite-logo-535777": "NS홈쇼핑",
  "sprite-logo-535778": "홈앤쇼핑",
  "sprite-logo-535779": "GS MY SHOP",
  "sprite-logo-580001": "공영홈쇼핑",
  "sprite-logo-580002": "쇼핑엔T",
  "sprite-logo-590001": "KT알파 쇼핑",
  "sprite-logo-590002": "롯데OneTV",
  "sprite-logo-590003": "신세계 라이브쇼핑",
  "sprite-logo-590005": "현대홈쇼핑+Shop",
  "sprite-logo-590006": "CJ온스타일+",
  "sprite-logo-590007": "롯데OneTV",
  "sprite-logo-590008": "NS Shop+",
  "sprite-logo-600002": "홈앤쇼핑",
  "sprite-logo-600003": "KT알파쇼핑TV플러스",
  "sprite-logo-600004": "SK 스토아",
  "sprite-logo-700004": "KT알파 쇼핑",
};

const getStoreName = (className: string) => classNameToStoreName[className] || null;

const getVideoURL = (shopName: string) => {
  switch (shopName) {
    case "CJ온스타일":
      return "https://live-ch1.cjonstyle.net/cjmalllive/_definst_/stream2/playlist.m3u8";
    case "CJ온스타일+":
      return "https://live-ch2.cjonstyle.net/cjosplus/_definst_/live2/playlist.m3u8";
    case "롯데홈쇼핑":
      return "http://mohlslive.lotteimall.com/live/livestream/lotteimalllive_mp4.m3u8";
    case "롯데OneTV":
      return "http://onetvhlslive.lotteimall.com/lotteonetvlive/_definst_/lotteonetvlive.mp4.m3u8";
    case "신세계 라이브쇼핑":
      return "http://wliveout.kollus.com/shinsegaetvshopping_h0000k/index.m3u8";
    case "KT알파 쇼핑":
      return "https://livetv.kshop.co.kr/klive/_definst_/smil:klive.smil/playlist.m3u8";
    case "SK 스토아":
      return "http://cast.skstoa.com:8080/live/SKSTOA.daml/playlist.m3u8";
    case "홈앤쇼핑":
      return "http://livevod.hnsmall.com:1935/live/mp4:a.stream/playlist.m3u8";
    case "NS홈쇼핑":
      return "http://livestream.nsmall.com:1935/IPHONE/nsmallMobile.m3u8";
    case "KT알파쇼핑TV플러스":
      return "https://livetv.kshop.co.kr/livetv1/_definist_/smil:livetv1.smil/playlist.m3u8";
    case "NS Shop+":
      return "http://shoppstream.nsmall.com:1935/IPHONE/mobile.m3u8";
    case "더블유쇼핑":
      return "http://liveout.catenoid.net/live-05-wshopping/wshopping_1500k/playlist.m3u8";
    case "쇼핑엔T":
      return "http://114.108.31.23/live/10012.m3u8";
    case "현대홈쇼핑":
      return "https://cdnlive.hmall.com/live/ngrp:hmall.stream_mobile/playlist.m3u8";
    case "현대홈쇼핑+Shop":
      return "https://dtvstreaming.hyundaihmall.com/newcjp3/_definst_/newcjpstream.smil/playlist.m3u8";
    case "공영홈쇼핑":
      return "https://etv.publichs.com/live5.stream/playlist.m3u8";
    case "GS MY SHOP":
      return "http://gstv-myshop.gsshop.com/myshop_hd/_definst_/myshop_hd.stream/playlist.m3u8";
    case "GS SHOP":
      return "http://gstv-gsshop.gsshop.com/gsshop_hd/_definst_/gsshop_hd.stream/playlist.m3u8";
    default:
      return null;
  }
};
