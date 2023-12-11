import { load } from "cheerio";
import { html } from "./camp_shorts_html";
import fs from "fs";

const $ = load(html);

const list: any = [];
$("ytd-video-renderer").each((index, element) => {
  const thumbnailUrl = $(element).find("ytd-thumbnail img").attr("src") || "";
  const title = $(element).find("#video-title > yt-formatted-string.style-scope.ytd-video-renderer").text();
  const videoLink = "https://www.youtube.com" + ($(element).find("a#video-title").attr("href") || "");
  const viewCount = $(element).find(".inline-metadata-item").first().text();
  const publishedDate = $(element).find(".inline-metadata-item").eq(1).text();
  const authorName = $(element)
    .find("yt-formatted-string > a.yt-simple-endpoint.style-scope.yt-formatted-string")
    .first()
    .text();
  const authorImage = $(element).find("#channel-thumbnail img").attr("src") || "";
  const description = $(element)
    .find("yt-formatted-string.metadata-snippet-text.style-scope.ytd-video-renderer")
    .text();
  const category = "캠핑꿀팁";

  list.push(
    `('${thumbnailUrl.replace(/'/g, "''")}', '${title.replace(/'/g, "''")}', '${videoLink.replace(
      /'/g,
      "''"
    )}', '${viewCount.replace(/'/g, "''")}', '${publishedDate.replace(/'/g, "''")}', '${authorName.replace(
      /'/g,
      "''"
    )}', '${authorImage.replace(/'/g, "''")}', '${description.replace(/'/g, "''")}', '${category.replace(/'/g, "''")}')`
  );
});

const sqlQuery = `INSERT IGNORE INTO shorts (thumbnail_url, title, video_link, view_count, published_date, author_name, author_image, description, category) VALUES ${list.join(
  ", "
)};`;

fs.writeFile("camp_shorts_html.log", sqlQuery, (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
});
