import axios from "axios";
import { AuthorizationKey } from "../auth";
import { NODE_API_URL_CAMP } from "../common";
import { NaverDataType, SaveNaverUsedType } from "./getNaverUsedList.d";
import { l } from "../console";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// #3 실제 저장 및 불러오기
export const getNaverUsedStoreListAndSave = async (product_id: number, keyword: string | null) => {
  if (keyword === null) return l("NaverUsed", "yellow", "중고거래 keyword가 없습니다. pass");
  const list = await getNaverUsedData(product_id, keyword);
  await saveNaverUsedData(product_id, list);
  l("NaverUsed", "green", `중고거래 데이터를 성공적으로 가져왔습니다. 필터링전 갯수: ${list.length}`);
};

// #1 중고거래 데이터 가져오기
const getNaverUsedData = async (product_id: number, keyword: string) => {
  const createMobileCafeLink = (data: NaverDataType["result"]["tradeArticleList"][0]["item"]) => {
    return `https://m.cafe.naver.com/ca-fe/web/cafes/${data.cafeId}/articles/${data.articleId}?art=${data.art}`;
  };
  // const createWebCafeLink = (data: NaverDataType["result"]["tradeArticleList"][0]["item"]) => {
  //   const iframeUrl = encodeURIComponent(
  //     `/ArticleRead.nhn?clubid=${data.cafeId}&articleid=${data.articleId}&art=${data.art}`
  //   );
  //   return `https://cafe.naver.com/${data.cafeUrl}?iframe_url=${iframeUrl}`;
  // };
  try {
    const response = await axios.get<NaverDataType>(
      "https://apis.naver.com/cafe-web/cafe-search-api/v5.0/trade-search/all",
      {
        params: {
          recommendKeyword: true,
          query: keyword,
          // categoryId: "50000007", //캠핑 관련 카테고리
          searchOrderParamType: "DEFAULT", //정렬순서
          page: 1,
          size: 100,
        },
        headers: { "Accept-Encoding": "deflate, br, zstd" },
      }
    );

    const result: SaveNaverUsedType[] = response.data.result.tradeArticleList.map(({ item }) => ({
      camp_keyword: keyword,
      product_id: product_id,
      store_link: createMobileCafeLink(item),
      store_image: item.thumbnailImageUrl,
      store_name: item.cafeName,
      product_name: item.productSale.productName,
      price: item.productSale.cost,
      cafe_id: item.cafeId,
      article_id: item.articleId,
      menu_id: item.menuId,
      cafe_url: item.cafeUrl,
      member_key: item.memberKey,
      author_nick_name: item.authorNickName,
      cafe_name: item.cafeName,
      cafe_thumbnail_image_url: item.cafeThumbnailImageUrl,
      subject: item.subject,
      content: item.content,
      sc: item.sc,
      art: item.art,
      escrow: item.productSale.escrow ? 1 : 0,
      sale_status: item.productSale.saleStatus,
      product_condition: item.productSale.productCondition,
      category1_id: item.productSale.tradeCategory.category1Id,
      category2_id: item.productSale.tradeCategory.category2Id,
      category3_id: item.productSale.tradeCategory.category3Id,
      category1_name: item.productSale.tradeCategory.category1Name,
      category2_name: item.productSale.tradeCategory.category2Name,
      category3_name: item.productSale.tradeCategory.category3Name,
      region_list: item.productSale.regionList,
      delivery_type_list: item.productSale.deliveryTypeList.join(", "),
      power_cafe: item.powerCafe ? 1 : 0,
      town_cafe: item.townCafe ? 1 : 0,
      attach_image_count: item.attachImageCount,
      write_at: new Date(item.writeTime + 32400000).toISOString().slice(0, 19).replace("T", " "),
      write_time: item.writeTime,
    }));
    return result;
  } catch (error) {
    console.error("Error fetching Naver Cafe data:", error);
    return [];
  }
};

// #2 중고거래 데이터 저장하기
const saveNaverUsedData = async (product_id: number, store_list: SaveNaverUsedType[]) => {
  await axios.post(`${NODE_API_URL_CAMP}/crawling/store/naver-used`, { product_id, store_list }).catch(console.error);
};

// getStoreListAndSave(101, "텐트마크디자인 TC");
