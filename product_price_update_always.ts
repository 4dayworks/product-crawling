import axios from "axios";
import { AuthorizationKey } from "./function/auth";
import { updateByProductId } from "./all_update";
import { l } from "./function/console";
axios.defaults.headers.common["Authorization"] = `Bearer ${AuthorizationKey()}`;

// GCP 자동 인스턴스 재생성 후
// 해당 인덱스로 이동을 위해 메타데이터를 넣어줄떄 사용합니다.
const execute = async () => {
  const startIndex = await axios
    .get("http://metadata.google.internal/computeMetadata/v1/instance/?recursive=true", {
      headers: {
        "Metadata-Flavor": "Google",
      },
    })
    .then((d: { data: ResponseType }) => {
      const regex = /start-index-(\d+)/;
      const startIndex = d.data.name.match(regex)?.[0];
      l("Info", "blue", "instance name:" + d.data.name + " / " + Number(startIndex));
      return !isNaN(Number(startIndex)) ? Number(startIndex) : undefined;
    })
    .catch(() => undefined);
  while (true) {
    await updateByProductId({ startIndex });
  }
};
execute();

type ResponseType = {
  attributes: {
    "ssh-keys": string;
  };
  cpuPlatform: string;
  description: string;
  disks: [{ deviceName: "persistent-disk-0"; index: 0; interface: "SCSI"; mode: "READ_WRITE"; type: "PERSISTENT" }];
  guestAttributes: {};
  hostname: string;
  id: number;
  image: string;
  licenses: [{ id: string }];
  machineType: string;
  maintenanceEvent: string;
  name: string; //"product-crawling-202306201451-cd0dd723-start-index-24";
  networkInterfaces: [
    {
      accessConfigs: [{ externalIp: string; type: "ONE_TO_ONE_NAT" }];
      dnsServers: [string];
      forwardedIps: [];
      gateway: string;
      ip: string;
      ipAliases: [];
      mac: string;
      mtu: 1460;
      network: string;
      subnetmask: string;
      targetInstanceIps: [];
    }
  ];
  preempted: string;
  remainingCpuTime: -1;
  scheduling: { automaticRestart: "TRUE"; onHostMaintenance: "MIGRATE"; preemptible: "FALSE" };
  serviceAccounts: {};
  tags: [];
  virtualClock: { driftToken: "0" };
  zone: string;
};
