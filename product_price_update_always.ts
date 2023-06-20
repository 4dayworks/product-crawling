import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// GCP 자동 인스턴스 재생성 후
// 해당 인덱스로 이동을 위해 메타데이터를 넣어줄떄 사용합니다.
const execute = async () => {
  const response = await axios
    .get("http://metadata.google.internal/computeMetadata/v1/instance/?recursive=true", {
      headers: {
        "Metadata-Flavor": "Google",
      },
    })
    .then((d) => d.data)
    .catch(() => null);
  console.log(response);
  const startIndex = response ? response : 0;
  while (true) {
    await updateByProductId({ startIndex });
  }
};
execute();
