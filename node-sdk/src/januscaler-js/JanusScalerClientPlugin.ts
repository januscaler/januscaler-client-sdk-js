import { JanusScalerClient, SharedState } from "./JanusScalerClient";
import { JanusScalerClientSession } from "./JanusScalerClientSession";
import { JanusScalerWebRTCStack } from "./JanusScalerWebRTCStack";
import { Subject } from "rxjs";
import _ from "lodash";
import { JanusScalerWebsocketTransport } from "./JanusScalerWebsocketTransport";
export class JanusScalerClientPlugin {
  webRTCStack?: JanusScalerWebRTCStack;
  onMessage: Subject<{ message: any; jsep: RTCSessionDescription }>;
  onTrack: Subject<{ track: MediaStreamTrack | any; mid: string; flowing: boolean; data: { reason: string } }>;

  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, public handleId: string, protected session: JanusScalerClientSession, protected transport: JanusScalerWebsocketTransport) {
    this.onMessage = new Subject();
    this.onTrack = new Subject();
    this.transport.onMessage.subscribe((data) => {
      if (data.sender === handleId && data.janus === "event") {
        if (_.isFunction(this.onMessage.next))
          this.onMessage.next({
            message: _.get(data, "plugindata.data"),
            jsep: data.jsep,
          });
      }
    });
  }
  dispose() {
    this.onMessage.unsubscribe();
    this.onTrack.unsubscribe();
  }

  async handleRemoteJsep(jsep: any) {
    await this.webRTCStack.peerConnection.setRemoteDescription(jsep);
  }
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.webRTCStack.peerConnection?.createOffer();
    await this.webRTCStack.peerConnection?.setLocalDescription(offer);
    return offer;
  }
  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const answer = await this.webRTCStack.peerConnection?.createAnswer();
    await this.webRTCStack.peerConnection?.setLocalDescription(answer);
    return answer;
  }

  async trickle(candidate: RTCIceCandidate | null) {
    const payload: any = {
      janus: "trickle",
      handle_id: this.handleId,
      session_id: this.session.sessionId,
      candidate,
    };
    return this.transport.send(payload);
  }

  async send(body: any, jsep?: RTCSessionDescription | RTCSessionDescriptionInit): Promise<any> {
    const payload: any = {
      janus: "message",
      handle_id: this.handleId,
      session_id: this.session.sessionId,
      body: body,
    };
    if (jsep) {
      payload.jsep = jsep;
    }
    return this.transport.send(payload);
  }

  async proxy(
    node: string,
    {
      body,
      jsep,
      optionalProperties,
      janus,
    }: {
      optionalProperties?: any;
      janus?: string;
      body?: any;
      jsep?: any;
    }
  ): Promise<any> {
    return this.send({ request: "proxy", optionalProperties, node, janus, body, jsep });
  }

  async leave(): Promise<any> {
    return this.send({ request: "leave" });
  }
}
