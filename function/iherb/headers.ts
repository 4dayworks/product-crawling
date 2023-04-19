let i = 0;
export const headers = () => {
  const cookieList = [
    // "_px3=b7c5bc103823c153b5bc5ad3b318a547dee81231c30a9c97ed54f06be023e1bc:CA4sZjzhlkYm2UNrMgWiXdOnkyCnswzE853DwEeh7rf52fzT2l8sazrAeNP/MAEDvzHSBjnOmVwussSleY1j5g==:1000:I3arFgUS/mUixrXovM6qHk4+trBd7BvH1702xrfiy94RkrrR5DJmer0XJY46aUHDGNR96lyeeFThN6Smc8FKVx82EVf0XJgkEOw7tKsfNd6K2iCknAvitzAdyQYkJ0PY+sx/2OAQPFAglHAEs19Luq6XGeXEvjr897F77N+L0Bpkq7633nMK9385AH39Dwl/MoNoiR4jVLYx3TD7cXmZAQ==",
    // "_px3=85a3590355bed9e4b6739cf3dd5ca01d30638b8d93d30d813e4e3777fc2a816a:fsXLG/ElsIFhmcu/QZFOkHN7N3OUi/z7nAJYIscpuLTw84IUdD5kv5NjNhf7HBYRz4qalC23ho9lpExPS3350w==:1000:kle+bEI8B/rVHCfFuOUR+NA7XR5QR2h6H5EhPo++EH89ziXAYow/fF3yFEmRvb1M7z/fW2LioAVJYcS3rXEd3pBOBV+GlVn4SFUTDiUsASjWKm02AwOzXp5AeKQ4VgrtGjspFOmSO02geoAE8k+OHgzeuRMwZ/yKqddXPv673UiJF8L0U1zlwViCE27R2SJRLh0JVRb3DVkFxyp0paEKVQ==",
    // "_px3=247e49052a0590e5ddeed16b4cb5339b99c63f3664c686370f9c55df0a16d695:VCTPcRRltzsvNlQj7bVj4yrZlVcvtVgEnFwfvVocZNScRDB7n/ITqTPEbo8hNeMjgi0waxBVNnKSylEynZxBAw==:1000:2Qo2sG0P7am4kNlGYuvy2kd2TRhnqaeTnrxyDzSpGPj7ZLy0Gcvd6IV4uMgUk7qDCY8OVsbVjkHN5Ov3DfZOQ0mu6j/oAOgpT7XTAWsmnFlmbJAvY7sAtNY0x1jQNz76V34VCdkyuk/e2rdDBdclYOYIgKaMd1hiVADLk8267vqO8fJXoGNOXn4+a90PFLtt17GxJZF8XAHAo9lwnDkyfg==",
    // "_px3=5bac1d1cd15a23149bbe7742040f9bdf62401b5023e778dcbe35ab51a440e5fd:H1f9C5T4T8LFfHJH2wzR0cc4CamWn+WmAxbPAsT6A59rQOWtKW6xLVYo2L52BlKb1t5aXXSu5gy5ylYWhRqjxw==:1000:9I2X2N1NNW8lM/d8mT3sN6+c76DiC55spXdztD8+8H7jd+H9d6DVIpHjOlaCKCIuhNoze+7/BOu4LInItrVdu5ab9huedZ+hgzL5vqh0Lz1EcaYl77sYzrPFsVye5nnYnsTxLKC3FQFU31TLmMp5/YsMJWL5Jt173Pd0hb5KhEvXpCABD5RTD/zDl8u2Mbksal8Z8PGE8tZdscHvxKujqw==",
    // "_px3=741a8cadac13b4e37af01965b6d3d3cfffe96a7020b2fa3da85d9f955a1604cb:wdbrBkPT1HfF3kt9M545z8RpaEPfNqc3/XGuKiBh2AyOBTf2tMdEP7MmOWsJgDe9WhYnkwFC7QxCtZQ+Gld8FA==:1000:uVhapcKQ+LtCJBsMrOuwMolqRgwcCt5f+5GyXy7JZVqPlpCWjq/mDMSFCMRkkZhZ2c1L7Mb6Jb8mXkYIbP+CVzBf9+Gcq5a/zqPOQwrN0BFhisgvXhN1p+3nCIDVZdSWLV7RoIsdo9aaWGJvfBHT9C93H4X1dCD1Yryo+vySwlBY/Aq50R3JFDDzDztpZbliq6t7QCijGaQDKo+Octa6Xg==",
    // "_px3=a6644f354ac7885badd6295035c88109147ba3f4dfced5c71800231d3e82bb49:XMUGBo4i/tswVDiU2herOQG9H322WfBdIMXb2Eg4tr4ATW32dtIai3F1PzcWtlbdnfwf7YNhJdrsyp8iU80X3A==:1000:xe6mYdDWM1MS/L0kfZpLa0ztCSyMhKjHM4w5jcSr/3ScH45DDV0yQ0FM+9DUOpN+U3zKRVMfZqunQ+mTDButLA1FFefK5jU83uwtPIA6seph+E67jA6uKvZMg9IL59Z+cnTzoUWVlRFvpN2Gm+Mek6sa9/YkF4nPp/ISw2R4MSBfCY9xbrsV2xOUrpbwEGc+Myi0xvsAOCMA33q7OHiSXA==",
    // "_px3=0cdf5fc065a6e959a0cbb42e44a516a4e462199f044061553770734544d6f6a3:kJcVtBFJr8RAhs2248ci9i4XJBkIbxemJ8YlIwfwEHigu/mUGL5xYNM4Sz582SvPTYqFK/2IiMr7wnn0dws6ww==:1000:e2Nv91FaeJuOSZ5HNjYiaRdxyWHrDu4ey2NpYOWJ8/FFvkI5n1T0l+/0MlOYEWIjJeyMFOQReaUyLCl5C6suc46LuTcUO0YN6eoY6+fVHAjL0sK4gnZKrDPLh5wqkuAr6c1JEeEYQWvYFjHBQwxGYTkk744a7ra+zKbOSM2ecckCO0qpD3YIS5+9r996U6QkS0AIOIQjhYVm8OFf++M2tQ==",
    // "_px3=2a139608450c7b01eb77903f965af9c8dbabc22aa2431e1a913330c60263762e:m1Gtp72mvitoagtECRLImHGIMCoCSNkPws3KuhBZkZ/QK5oJ0z0w8H+MZUW54BMOd0XxS3l+1yWGzxGyRe7ltg==:1000:suC+c1XNt8WxIogsmyU60y8qrhGqMGwSbYY8cztO7r46l4XkYGS5UJ3nDL9ssygIQioafh7jxCuMja83uigKmZvobViJL6DKHkN4flf/i1DPY7e7ztUqpBzLY4Za0ytkwivMPAMeAp3/KsuCXr6EgVqAYdgBS4ZajZc5VxW4x79d7FEvsajxWsVKO9cEzYhFfM9iFybkHDpjs6aGQyA+oQ==",
    "_px3=80c43b8f959e8171ab804a9050a2eed8863970908d4074a87fd37e72d27e034a:T7h6tHbKDVLT+Z3BwQXfpekkn0eXGqGmELSGY/CvVHde1ETJtBimDkzpiDBL06effOdsxydeVQuQIQKt9VJjtQ==:1000:JlyeYy+je1PmxOLRHJbbZirYtZ5klQcZmnJTtFMevP52NCu9aT9TVq/08iP54+p3Eej8JesoDPDniqN3f3jpuwzwghN3nDsP9c1FJ6F7ekrW1+a8Yc9aKdPs9TNMQRGgokyjg8fqufV50uzc8JFYDYbBL8u6z0IPkzdZ+InbraR7rPmHNjpziIiD+6fe7IK1axy9wofUd/nYHjpiU4+kUw==",

    undefined,
  ];
  const cookie = cookieList[i % cookieList.length];
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
