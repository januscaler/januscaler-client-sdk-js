import { JanusScalerAdminSession } from "./JanusScalerAdminSession";
import { JanusScalerClientSession } from "./JanusScalerClientSession";
import { JanusScalerWebsocketTransport } from "./JanusScalerWebsocketTransport";
export class SharedState {
  constructor({ peerConnectionConfiguration }: { peerConnectionConfiguration?: RTCConfiguration }) {
    this.peerConnectionConfiguration = peerConnectionConfiguration;
  }
  public peerConnectionConfiguration?: RTCConfiguration;
}
export class JanusScalerClient {
  constructor(
    public transport: JanusScalerWebsocketTransport,
    {
      apiSecret,
      token,
      adminSecret,
      peerConnectionConfiguration,
    }: {
      apiSecret?: string;
      token?: string;
      adminSecret?: string;
      peerConnectionConfiguration?: RTCConfiguration;
    } = {}
  ) {
    this.transport.credentials = { adminSecret, apiSecret, token };
    this.sharedState = new SharedState({ peerConnectionConfiguration });
  }

  private sharedState: SharedState;

  async createSession(): Promise<JanusScalerClientSession> {
    await this.transport.init();
    const session = await this.transport.send({
      janus: "create",
    });
    return new JanusScalerClientSession(this,this.sharedState, session.data.id, this.transport);
  }
  async getAdminSession(): Promise<JanusScalerAdminSession> {
    await this.transport.init();
    return new JanusScalerAdminSession(this, this.transport);
  }
}
