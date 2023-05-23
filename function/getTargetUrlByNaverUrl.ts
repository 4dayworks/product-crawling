import axios from "axios";

// const link = 'https://cr.shopping.naver.com/adcr.nhn?x=DxQLZKmnSszWYJ6xdbJQ3P%2F%2F%2Fw%3D%3Dsk8chBxyQZhqqxmnDNT1nldAu0yQNSlKr2B64yokW%2Fbx5%2BpLxY5QZ3ld%2BPTR1fWb8GTnlnTmznDo%2F8qJotbSzcPNz5AAGWOGJCDNdo2j3%2Fv59cxIlp88eMTdnWWMwd5cOqNXz9C6GIlhl6NJDuv7WEMjgf1FQQ9h0hAf7fZvaPbm8%2BhWKH28kqWLI%2Fcre%2Bc7qv57zQd1mLMhCqXiLce9k%2FuOn23nmg4gJetDyLZcSjYvLI1oWGLdtV8CybqBHLMZgCA5NFBNAZKGl4lNaAK%2FpXNPkwtosKeaGJLW3yMscVPDtTR8sodNZmN4Yc64%2B0L6P4MBYyUwGaW%2FXZ0L0C8wHBxQzz3qGgpH7pX7tmWlD7KIHs%2F2PHkpmvWjL2qy1nHubhJAS5z5EGz%2F%2BvcGWrMkQRpz47w0UG9NEiJ3LiPigft1%2FlLnJwMa7Bt8R2%2FUDqQrCex7VTVEbR8%2BhZJwBuTPAwreIL4r3TFeIjtgnWiXAZVYE2JwliXHa6p4CtkIXMk6KinLgLrB9YtgCMWx64N%2Fdp00f4AQ%2F%2F5snlKsbMnuaH80ofOVrF3Hoka0KYoqXOGGBUjcMHCCIiGwPnXS48ziFWwSsiWtSBozd7ziXSkAepHrICf7mlmuxGJ1UoDWUDYgKPMLclfISJ86ea%2BY4M2kFqmFZtPxRSN2Uy0q11IIVbu3MzdWgIdW7YDje0DSHNwXqfAl5dudTqZlos35c9ihFnJNtbjRLkBMTKnEovURmb6AIxeB%2BNdHSMyneJEOFsjr%2FzY6of2Xpggjm6A4Z8HgJhg%3D%3D&nvMid=34286761745&catId=50002425';

/**
 * @param url url에 cr.shopping.naver.com이 있으면 네이버링크로 인식하고 target_url을 가져옵니다.
 * @returns
 */
export const getTargetUrlByNaverUrl = async (url: string) => {
  const link = url.includes("cr.shopping.naver.com")
    ? await axios
        .get(url, {
          headers: {
            "Accept-Encoding": "json", // gzip 압축 비활성화
          },
        })
        .then((res) => {
          const body = res.data as string;
          if (body.includes("function skipBridgePage() {")) {
            const skipBridgePageFunc = body.slice(
              body.indexOf("function skipBridgePage() {"),
              body.indexOf("function stopBridgePage() {")
            );
            const targetURL = skipBridgePageFunc.split('"').filter((s) => s.includes("http"));
            return targetURL.length > 0 ? targetURL[0] : null;
          } else {
            const metaUrl = body.slice(
              body.indexOf('property="og:url"'),
              body.indexOf('"/><meta name="next-head-count"')
            );
            const targetURL = metaUrl.split('"').filter((s) => s.includes("http"));
            return targetURL.length > 0 ? targetURL[0] : null;
          }
        })
        .catch((error) => {
          console.error("getTargetUrlByNaverUrl GET 요청 실패:", error);
          return null;
        })
    : url;
  return link;
};
