let i = 0;
export const headers = () => {
  const cookieList = [
    // "_px3=b7c5bc103823c153b5bc5ad3b318a547dee81231c30a9c97ed54f06be023e1bc:CA4sZjzhlkYm2UNrMgWiXdOnkyCnswzE853DwEeh7rf52fzT2l8sazrAeNP/MAEDvzHSBjnOmVwussSleY1j5g==:1000:I3arFgUS/mUixrXovM6qHk4+trBd7BvH1702xrfiy94RkrrR5DJmer0XJY46aUHDGNR96lyeeFThN6Smc8FKVx82EVf0XJgkEOw7tKsfNd6K2iCknAvitzAdyQYkJ0PY+sx/2OAQPFAglHAEs19Luq6XGeXEvjr897F77N+L0Bpkq7633nMK9385AH39Dwl/MoNoiR4jVLYx3TD7cXmZAQ==",
    // "_px3=85a3590355bed9e4b6739cf3dd5ca01d30638b8d93d30d813e4e3777fc2a816a:fsXLG/ElsIFhmcu/QZFOkHN7N3OUi/z7nAJYIscpuLTw84IUdD5kv5NjNhf7HBYRz4qalC23ho9lpExPS3350w==:1000:kle+bEI8B/rVHCfFuOUR+NA7XR5QR2h6H5EhPo++EH89ziXAYow/fF3yFEmRvb1M7z/fW2LioAVJYcS3rXEd3pBOBV+GlVn4SFUTDiUsASjWKm02AwOzXp5AeKQ4VgrtGjspFOmSO02geoAE8k+OHgzeuRMwZ/yKqddXPv673UiJF8L0U1zlwViCE27R2SJRLh0JVRb3DVkFxyp0paEKVQ==",
    // "_px3=247e49052a0590e5ddeed16b4cb5339b99c63f3664c686370f9c55df0a16d695:VCTPcRRltzsvNlQj7bVj4yrZlVcvtVgEnFwfvVocZNScRDB7n/ITqTPEbo8hNeMjgi0waxBVNnKSylEynZxBAw==:1000:2Qo2sG0P7am4kNlGYuvy2kd2TRhnqaeTnrxyDzSpGPj7ZLy0Gcvd6IV4uMgUk7qDCY8OVsbVjkHN5Ov3DfZOQ0mu6j/oAOgpT7XTAWsmnFlmbJAvY7sAtNY0x1jQNz76V34VCdkyuk/e2rdDBdclYOYIgKaMd1hiVADLk8267vqO8fJXoGNOXn4+a90PFLtt17GxJZF8XAHAo9lwnDkyfg==",
    "_px3=5bac1d1cd15a23149bbe7742040f9bdf62401b5023e778dcbe35ab51a440e5fd:H1f9C5T4T8LFfHJH2wzR0cc4CamWn+WmAxbPAsT6A59rQOWtKW6xLVYo2L52BlKb1t5aXXSu5gy5ylYWhRqjxw==:1000:9I2X2N1NNW8lM/d8mT3sN6+c76DiC55spXdztD8+8H7jd+H9d6DVIpHjOlaCKCIuhNoze+7/BOu4LInItrVdu5ab9huedZ+hgzL5vqh0Lz1EcaYl77sYzrPFsVye5nnYnsTxLKC3FQFU31TLmMp5/YsMJWL5Jt173Pd0hb5KhEvXpCABD5RTD/zDl8u2Mbksal8Z8PGE8tZdscHvxKujqw==",
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
