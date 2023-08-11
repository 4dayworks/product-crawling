import cheerio from "cheerio";
import request from "request";
import { l } from "./function/console";
import { wrapSlept } from "./function/wrapSlept";
import axios from "axios";
import { NODE_API_URL } from "./function/common";
import { naverCatalogList } from "./function/naverCatalogImage/progressList";
import { AuthorizationKey } from "./function/auth";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

//#region sub-routine
const header = {
  Cookie:
    "spage_uid=; NNB=NV6O2DQOVHKWI; SHP_BUCKET_ID=3; sus_val=pT+kcN3uhyOXXWAuMfJ24OjW; ncpa=95694|ll60ua6g|4594411748c3a8a1a6fb329de7ce0f221ce3bd0d|95694|db86d98c4c9b44817be7ad9007ca3f14ea9bdd34:3205269|ll61kje8|5551ef99fe50187509a3eb400ccaf56e88aa7c1d|s_207b9cb3c86e4|7380b7250f97daa30564f824daa017c9b135afd2",
};
const getURL = (link: string) => ({
  url: link,
  headers: header,
});

export const getNaverCatalogImageList = ({ product_id, link }: { product_id: number; link: string }) => {
  return new Promise<string[]>(async (resolve, reject) => {
    console.log(link);

    try {
      request(getURL(link), async (error, response, body) => {
        if (error) {
          l("error request", "red", error);
          throw error;
        }
        const $ = cheerio.load(body);

        try {
          const scriptContent = $("script#__NEXT_DATA__").html();
          if (scriptContent) {
            const imageList = parseHTML(scriptContent);
            console.log(imageList);
            if (imageList.length > 0) return resolve(imageList);
          }

          // // request로 forward 사이트 이동하기
          // const scriptContent2 = $("script[data-react-helmet='true'][type='application/ld+json']").html();
          // if (scriptContent2) {
          //   const jsonData = JSON.parse(scriptContent2);
          //   if (jsonData.offers && jsonData.offers.url) {
          //     const storeURL = jsonData.offers.url;

          //     request(getURL(storeURL), async (error, response, body) => {
          //       const scriptContent = $("script#__NEXT_DATA__").html();
          //       if (scriptContent) {
          //         const imageList = parseHTML(scriptContent);
          //         if (imageList.length > 0) return resolve(imageList);
          //       }
          //     });
          //   }
          // }

          return resolve([]);
        } catch (error) {
          l("error 1", "red", `product_id:${product_id.toString().padStart(5)}`);
          reject([]);
        }
      });
    } catch (error) {
      l("error 2", "red", `product_id:${product_id.toString().padStart(5)}`);
      reject([]);
    }
  });
};

const parseHTML = (scriptContent: string): string[] => {
  const jsonData = JSON.parse(scriptContent);

  if (jsonData.props && jsonData.props.pageProps.initialState) {
    // 1. HTML parse (네이버 쇼핑몰 영역)

    const list = jsonData.props.pageProps.initialState;

    if (list && list.specInfo) {
      const imageList = list.specInfo.catalogSpecImages.map(
        (img: { content: string }) => "https://shopping-phinf.pstatic.net" + img.content
      );
      if (imageList.length > 0) return imageList;
    }

    // 2. HTML parse(외부 쇼핑몰 영역)
    const spec = list.catalog.specInfo.catalogSpec;
    if (spec) {
      const imageHTML = spec.catalogSpecContent;
      const regex: RegExp = /src="([^"]+)"/g;
      const imageList: string[] = [];
      let match: RegExpExecArray | null;
      while ((match = regex.exec(imageHTML)) !== null) imageList.push(match[1]);
      return imageList;
    }
  }
  return [];
};
//#endregion

//#region MAIN Source
const updateProductImage = async () => {
  for (let i = 448; i < naverCatalogList.length; i++) {
    const item = naverCatalogList[i];
    // get image list
    // if (item.product_id != 33) continue;
    const imgList = await getNaverCatalogImageList(item);

    // set image list
    await axios.post(`${NODE_API_URL}/product/image`, { imgList, product_id: item.product_id });
    l(
      `[${i + 1}/${naverCatalogList.length}]`,
      "cyan",
      `product_id:${item.product_id} image length : ${imgList.length}`
    );

    await wrapSlept(100);
  }
};
updateProductImage();
//#endregion
