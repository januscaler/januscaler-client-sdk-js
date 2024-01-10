import { JanusScalerClient, SharedState } from "../JanusScalerClient";
import { JanusScalerClientPlugin } from "../JanusScalerClientPlugin";
import { JanusScalerClientSession } from "../JanusScalerClientSession";
import { JanusScalerWebsocketTransport } from "../JanusScalerWebsocketTransport";
import { JanusScalerClientAudioBridgeCreateRoomPayload } from "../interfaces";

export class JanusScalerClientVideoCallPlugin extends JanusScalerClientPlugin {
  static identifier = "janus.plugin.videocall";
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, handleId: string, session: JanusScalerClientSession, transport: JanusScalerWebsocketTransport) {
    super(client, sharedState, handleId, session, transport);
  }

  async register(username: string): Promise<any> {
    return this.send({
      request: "register",
      username,
    });
  }
}
