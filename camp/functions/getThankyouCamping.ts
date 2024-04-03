import axios from "axios";
import { load } from "cheerio";
import { l } from "../../function/console";
import fs from "fs/promises";
import { has, template } from "lodash";

export async function getThankyouCampingData() {
  let page = 1;
  let hasNext = true;

  // 추출할 데이터를 담을 배열
  const list: { id: string; title: string; address: string }[] = [];

  while (hasNext) {
    const data = {
      res_dt: "",
      res_edt: "",
      region: "",
      region_all: "",
      sub_region: "",
      disp_site_tp: "",
      tema: "",
      camp_tp: "",
      partnseq: "",
      page_num: page,
      res_url: "",
      res_back: "",
      tq_push_yn: "",
      tq_loc_yn: "",
      thankq_app: "",
      reseventseq: "",
      login_loc: "",
      couponId: "",
      pre_url: "list.hbb",
      ser_st: "N",
      mem_lat: "",
      mem_lng: "",
      nearby: "",
      ser_res_dt: "",
      ser_res_edt: "",
      ser_res_days: 1,
      ser_keyword: "",
      ser_festa_yn: "",
      ser_sort: "P",
    };
    const res = await axios.post(`https://m.thankqcamping.com/resv/ax_list.hbb`, data).then((d) => d.data);
    // cheerio를 사용하여 HTML 로드
    if (!res) return l("Err", "red", "getThankyouCampingData no res");

    const $ = load(res);
    // 각각의 '.camp_div' 요소를 순회
    const tempList: { id: string; title: string; address: string }[] = [];
    $(".camp_div").each(function () {
      // 현재 '.camp_div'에 대한 클릭 이벤트 내의 숫자 추출
      const onclickAttr = $(this).find("a").attr("href");
      const onclickNumbers = onclickAttr ? onclickAttr.match(/clkView\((\d+),'0'\);/) : null;
      const id = onclickNumbers ? onclickNumbers[1] : null;

      // '.txt_box' 내의 데이터 추출
      const title = $(this).find(".txt_box .tit").text().trim();
      const address = $(this).find(".txt_box .addr").text().trim();

      // 추출된 데이터를 배열에 추가
      if (id && title && address) {
        tempList.push({ id, title, address });
      }
    });
    console.info("getThankyouCampingData page:", page, tempList.length, new Date().toISOString());
    hasNext = tempList.length === 20;
    page++;
    list.push(...tempList);

    // if (page > 10) break;
  }

  saveData(list);
}
getThankyouCampingData();

async function saveData(list: any[]) {
  // JSON 데이터를 문자열로 변환
  const dataString = JSON.stringify(list, null, 2);

  try {
    // 'thankyoucamping-data.json' 파일에 데이터를 비동기적으로 쓴다.
    await fs.writeFile("thankyoucamping-data.json", dataString, "utf-8");
    l(
      "SUCCESS",
      "green",
      `getThankyouCampingData: Data saved to thankyoucamping-data.json successfully. length: ${list.length}`
    );
  } catch (error) {
    l("ERR", "red", "Error saving data to file:" + error);
  }
}
