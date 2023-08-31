declare module "tor-request" {
  import { EventEmitter } from "events";

  interface RequestOptions {
    url: string;
    // Add other request options here based on the actual usage
  }

  interface TorResponse {
    statusCode: number;
    headers: { [header: string]: string | string[] | undefined };
    body: string;
  }

  interface TorRequest {
    request(options: RequestOptions | string, callback: (err: any, res: TorResponse, body: any) => void): EventEmitter;
    setTorAddress(ipaddress: string, port: number): void;
    TorControlPort: {
      password: string;
      host: string;
      port: number;
      send(commands: string[], done: (err: any, data: any) => void): void;
    };
    newTorSession(done: (err: any) => void): void;
  }

  const torRequest: TorRequest;
  export default torRequest;
}
