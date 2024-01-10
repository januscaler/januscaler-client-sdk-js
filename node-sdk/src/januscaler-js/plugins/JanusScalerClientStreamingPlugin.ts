import { JanusScalerClient, SharedState } from "../JanusScalerClient";
import { JanusScalerClientPlugin } from "../JanusScalerClientPlugin";
import { JanusScalerClientSession } from "../JanusScalerClientSession";
import { JanusScalerWebsocketTransport } from "../JanusScalerWebsocketTransport";
import { JanusScalerClientStreamingConfigurePayload, JanusScalerClientStreamingCreatePayload, JanusScalerClientStreamingCreatedResponse, JanusScalerClientStreamingDestroyPayload, JanusScalerClientStreamingDestroyResponse, JanusScalerClientStreamingDisablePayload, JanusScalerClientStreamingEditPayload, JanusScalerClientStreamingEditResponse, JanusScalerClientStreamingEnablePayload, JanusScalerClientStreamingInfoPayload, JanusScalerClientStreamingInfoResponse, JanusScalerClientStreamingKickAllPayload, JanusScalerClientStreamingListResponse, JanusScalerClientStreamingSwitchPayload, JanusScalerClientStreamingWatchPayload } from "../interfaces";
export class JanusScalerClientStreamingPlugin extends JanusScalerClientPlugin {
  static identifier = "janus.plugin.streaming";
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, handleId: string, session: JanusScalerClientSession, transport: JanusScalerWebsocketTransport) {
    super(client, sharedState, handleId, session, transport);
  }

  create(payload: JanusScalerClientStreamingCreatePayload): Promise<JanusScalerClientStreamingCreatedResponse> {
    return this.send({
      request: "create",
      ...payload,
    });
  }

  edit(payload: JanusScalerClientStreamingEditPayload): Promise<JanusScalerClientStreamingEditResponse> {
    return this.send({
      request: "edit",
      ...payload,
    });
  }

  list(): Promise<JanusScalerClientStreamingListResponse> {
    return this.send({
      request: "list",
    });
  }

  info(payload: JanusScalerClientStreamingInfoPayload): Promise<JanusScalerClientStreamingInfoResponse> {
    return this.send({
      request: "info",
      ...payload,
    });
  }

  destroy(payload: JanusScalerClientStreamingDestroyPayload): Promise<JanusScalerClientStreamingDestroyResponse> {
    return this.send({
      request: "destroy",
      ...payload,
    });
  }

  enable(payload: JanusScalerClientStreamingEnablePayload): Promise<any> {
    return this.send({
      request: "enable",
      ...payload,
    });
  }

  disable(payload: JanusScalerClientStreamingDisablePayload): Promise<any> {
    return this.send({
      request: "disable",
      ...payload,
    });
  }

  kickAll(payload: JanusScalerClientStreamingKickAllPayload): Promise<any> {
    return this.send({
      request: "kick_all",
      ...payload,
    });
  }

  configure(payload: JanusScalerClientStreamingConfigurePayload): Promise<any> {
    return this.send({
      request: "configure",
      ...payload,
    });
  }

  watch(payload: JanusScalerClientStreamingWatchPayload): Promise<any> {
    return this.send({
      request: "watch",
      ...payload,
    });
  }

  start(jsep: RTCSessionDescription | RTCSessionDescriptionInit): Promise<any> {
    return this.send(
      {
        request: "start",
      },
      jsep
    );
  }

  pause(): Promise<any> {
    return this.send({
      request: "pause",
    });
  }

  stop(): Promise<any> {
    return this.send({
      request: "stop",
    });
  }

  switch(payload: JanusScalerClientStreamingSwitchPayload): Promise<any> {
    return this.send({
      request: "switch",
      ...payload,
    });
  }
}
