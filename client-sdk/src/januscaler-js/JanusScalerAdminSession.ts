import { JanusScalerClient } from "./JanusScalerClient";
import { JanusScalerWebsocketTransport } from "./JanusScalerWebsocketTransport";

export class JanusScalerAdminSession {
  constructor(protected client: JanusScalerClient, protected transport: JanusScalerWebsocketTransport) {}

  async listTokens() {
    return this.transport.send({
      janus: "list_tokens",
    });
  }
  async addToken(token: string) {
    return this.transport.send({
      janus: "add_token",
      token,
    });
  }
  async removeToken(token: string) {
    return this.transport.send({
      janus: "remove_token",
      token,
    });
  }
}
