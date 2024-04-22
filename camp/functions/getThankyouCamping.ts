import axios from "axios";
import { load } from "cheerio";
import { l } from "../../function/console";
import fs from "fs/promises";

export async function getThankyouCampingData() {
  let page = 1;
  let hasNext = true;

  // 추출할 데이터를 담을 배열
  const list: { id: string; title: string; address: string }[] = [];
  await fs.writeFile("thankyoucamping-data.csv", "id, title, address, is_inquiry\n", "utf-8");

  while (hasNext) {
    const res = await axios
      .post(
        `https://m.thankqcamping.com/resv/ax_list.hbb?res_dt=&res_edt=&region=&region_all=&sub_region=&disp_site_tp=&tema=&camp_tp=&partnseq=&page_num=${page}&res_url=&res_back=&tq_push_yn=&tq_loc_yn=&thankq_app=&reseventseq=&login_loc=&couponId=&pre_url=list.hbb&ser_st=N&mem_lat=&mem_lng=&nearby=&ser_res_dt=&ser_res_edt=&ser_res_days=1&ser_keyword=&ser_festa_yn=&ser_sort=P`,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
          },
        }
      )
      .then((d) => d.data);
    // cheerio를 사용하여 HTML 로드
    if (!res) return l("Err", "red", "getThankyouCampingData no res");

    const $ = load(res);
    // 각각의 '.camp_div' 요소를 순회
    const tempList: { id: string; title: string; address: string; inquiry: boolean }[] = [];
    $(".camp_div").each(function () {
      // 현재 '.camp_div'에 대한 클릭 이벤트 내의 숫자 추출
      const onclickAttr = $(this).find("a").attr("href");
      const onclickNumbers = onclickAttr ? onclickAttr.match(/clkView\((\d+),'0'\);/) : null;
      const id = onclickNumbers ? onclickNumbers[1] : "no_id";
      // '별도문의' 여부를 확인합니다.
      const inquiry = $(this).find(".txt_box .res_div .q_res.type4").length > 0;

      // '.txt_box' 내의 데이터 추출
      const title = $(this).find(".txt_box .tit").text().trim();
      const address = $(this).find(".txt_box .addr").text().trim();

      // 추출된 데이터를 배열에 추가

      tempList.push({ id, title, address, inquiry });
      saveData({ id, title, address, inquiry });
    });
    console.info("getThankyouCampingData page:", page, tempList.length, new Date().toISOString());

    page++;
    hasNext = tempList.length === 20;
  }
}
getThankyouCampingData();

async function saveData(item: { id: string; title: string; address: string; inquiry: boolean }) {
  // JSON 데이터를 CSV 문자열로 변환하고, 줄바꿈 문자를 추가합니다.
  const dataString = `${item.id}, "${item.title}", "${item.address}", ${item.inquiry ? true : false}\n`;

  try {
    // 'thankyoucamping-data.csv' 파일에 데이터를 비동기적으로 추가합니다.
    await fs.appendFile("thankyoucamping-data.csv", dataString, "utf-8");
  } catch (error) {
    l("ERR", "red", "Error appending data to file:" + error);
  }
}
