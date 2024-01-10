import { JanusScalerClient, SharedState } from "../JanusScalerClient";
import { JanusScalerClientPlugin } from "../JanusScalerClientPlugin";
import { JanusScalerClientSession } from "../JanusScalerClientSession";
import { JanusScalerWebsocketTransport } from "../JanusScalerWebsocketTransport";
import { JanusScalerClientAudioBridgeJoinRoomPayload, JanusScalerClientAudioBridgeCreateRoomPayload } from "../interfaces";

export class JanusScalerClientAudioBridgePlugin extends JanusScalerClientPlugin {
  static identifier = "janus.plugin.audiobridge";
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, handleId: string, session: JanusScalerClientSession, transport: JanusScalerWebsocketTransport) {
    super(client, sharedState, handleId, session, transport);
  }
  async configure(node: string, { jsep }: { jsep?: RTCSessionDescription }) {
    return this.proxy(node, {
      body: {
        request: "configure",
      },
      jsep,
    });
  }
  async joinRoom(payload: Omit<JanusScalerClientAudioBridgeJoinRoomPayload, "request">) {
    return this.send({
      request: "join",
      ...payload,
    });
  }
  async createRoom(payload: Omit<JanusScalerClientAudioBridgeCreateRoomPayload, "request">): Promise<any> {
    return this.send({
      request: "create",
      ...payload,
    });
  }
  async editRoom(payload: Omit<JanusScalerClientAudioBridgeCreateRoomPayload, "request">): Promise<any> {
    return this.send({
      request: "edit",
      ...payload,
    });
  }
}
