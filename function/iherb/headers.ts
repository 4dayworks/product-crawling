let i = 0;
export const headers = () => {
  const cookieList = [
    "_px3=85a3590355bed9e4b6739cf3dd5ca01d30638b8d93d30d813e4e3777fc2a816a:fsXLG/ElsIFhmcu/QZFOkHN7N3OUi/z7nAJYIscpuLTw84IUdD5kv5NjNhf7HBYRz4qalC23ho9lpExPS3350w==:1000:kle+bEI8B/rVHCfFuOUR+NA7XR5QR2h6H5EhPo++EH89ziXAYow/fF3yFEmRvb1M7z/fW2LioAVJYcS3rXEd3pBOBV+GlVn4SFUTDiUsASjWKm02AwOzXp5AeKQ4VgrtGjspFOmSO02geoAE8k+OHgzeuRMwZ/yKqddXPv673UiJF8L0U1zlwViCE27R2SJRLh0JVRb3DVkFxyp0paEKVQ==",
    //"_px3=247e49052a0590e5ddeed16b4cb5339b99c63f3664c686370f9c55df0a16d695:VCTPcRRltzsvNlQj7bVj4yrZlVcvtVgEnFwfvVocZNScRDB7n/ITqTPEbo8hNeMjgi0waxBVNnKSylEynZxBAw==:1000:2Qo2sG0P7am4kNlGYuvy2kd2TRhnqaeTnrxyDzSpGPj7ZLy0Gcvd6IV4uMgUk7qDCY8OVsbVjkHN5Ov3DfZOQ0mu6j/oAOgpT7XTAWsmnFlmbJAvY7sAtNY0x1jQNz76V34VCdkyuk/e2rdDBdclYOYIgKaMd1hiVADLk8267vqO8fJXoGNOXn4+a90PFLtt17GxJZF8XAHAo9lwnDkyfg==",
  ];
  const cookie = cookieList[i % cookieList.length];
  // console.log("axios index:", i);
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
