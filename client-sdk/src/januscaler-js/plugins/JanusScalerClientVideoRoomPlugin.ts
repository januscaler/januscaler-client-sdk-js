import { JanusScalerClient, SharedState } from "../JanusScalerClient";
import { JanusScalerClientPlugin } from "../JanusScalerClientPlugin";
import { JanusScalerClientSession } from "../JanusScalerClientSession";
import { JanusScalerWebsocketTransport } from "../JanusScalerWebsocketTransport";
import { JanusScalerClientVideoRoomClientConfigurePayload, JanusScalerClientVideoRoomClientJoinPayload, JanusScalerClientVideoRoomClientPublishPayload, JanusScalerClientVideoRoomCreatePayload } from "../interfaces";

export class JanusScalerClientVideoRoomPlugin extends JanusScalerClientPlugin {
  static identifier = "janus.plugin.videoroom";
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, handleId: string, session: JanusScalerClientSession, transport: JanusScalerWebsocketTransport) {
    super(client, sharedState, handleId, session, transport);
  }

  async publish(payload: JanusScalerClientVideoRoomClientPublishPayload, jsep: RTCSessionDescription) {
    return this.send(
      {
        request: "publish",
        ...payload,
      },
      jsep
    );
  }

  async joinRoom(payload: Omit<JanusScalerClientVideoRoomClientJoinPayload, "request">) {
    return this.send({
      request: "join",
      ...payload,
    });
  }

  async configure(payload: JanusScalerClientVideoRoomClientConfigurePayload, jsep: RTCSessionDescription | RTCSessionDescriptionInit | undefined) {
    return this.send(
      {
        request: "configure",
        ...payload,
      },
      jsep
    );
  }

  async createRoom(payload: Omit<JanusScalerClientVideoRoomCreatePayload, "request">): Promise<any> {
    return this.send({
      request: "create",
      ...payload,
    });
  }
}
