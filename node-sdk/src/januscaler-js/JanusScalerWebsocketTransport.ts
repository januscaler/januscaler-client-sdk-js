import _ from "lodash";
import { Subject } from "rxjs";
import { v4 } from "uuid";
import { JanusScalerClient } from "./JanusScalerClient";
export class JanusScalerWebsocketTransport {
  protected websocket: WebSocket;
  onMessage: Subject<any>;
  onConnected: Subject<any> = new Subject();
  onClosed: Subject<any> = new Subject();
  onError: Subject<any> = new Subject();
  private apiSecret?: string;
  private token?: string;
  private adminSecret: string;
  constructor(private websocketUrl: string, private protocol: string = "januscaler-protocol") {}

  set credentials({ apiSecret, adminSecret, token }: { apiSecret?: string; adminSecret?: string; token?: string }) {
    this.apiSecret = apiSecret;
    this.token = token;
    this.adminSecret = adminSecret;
  }

  close(code?: number, reason?: string) {
    this.websocket.close(code, reason);
  }

  async init(): Promise<any> {
    if (this.websocket) {
      return;
    }
    this.onMessage = new Subject();
    return new Promise<void>((resolve, reject) => {
      this.websocket = new WebSocket(this.websocketUrl, this.protocol);
      this.websocket.onopen = (event) => {
        this.websocket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.onMessage.next(data);
        };
        this.onConnected.next(event);
        resolve();
      };
      this.websocket.onclose = (event) => {
        this.onClosed.next(event);
      };
      this.websocket.onerror = (event) => {
        this.onError.next(event);
        reject(event);
      };
    });
  }

  async send(payload: any): Promise<any> {
    payload.transaction = v4();
    if (_.isNil(payload.adminSecret)) payload.adminSecret = this.adminSecret;
    if (_.isNil(payload.apiSecret)) payload.apiSecret = this.apiSecret;
    // payload.adminsecret = this.adminSecret;
    // payload.apisecret = this.apiSecret;
    if (_.isNil(payload.token)) payload.token = this.token;
    this.websocket.send(JSON.stringify(payload));
    return new Promise((resolve, reject) => {
      const subscription = this.onMessage.subscribe((data) => {
        const hasError = _.has(data, "error") || _.has(data, "error_code");
        if (data["transaction"] === payload.transaction && !hasError) {
          resolve(data);
          subscription.unsubscribe();
        }
        if (data["transaction"] === payload.transaction && hasError) {
          reject(data);
          subscription.unsubscribe();
        }
      });
    });
  }
}
