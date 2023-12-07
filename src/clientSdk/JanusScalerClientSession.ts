import { JanusScalerClient, SharedState } from "./JanusScalerClient";
import { JanusScalerClientPlugin } from "./JanusScalerClientPlugin";
import { JanusScalerWebRTCStack } from "./JanusScalerWebRTCStack";
import { JanusScalerWebsocketTransport } from "./JanusScalerWebsocketTransport";

export class JanusScalerClientSession {
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, public sessionId: string, protected transport: JanusScalerWebsocketTransport, sessionTimeOut = 50000) {
    this.sessionTimeOut = sessionTimeOut;
    this.startKeepAliveTimer();
  }
  private timer: any;
  private sessionTimeOut: number;
  protected async keepAlive(): Promise<any> {
    return this.transport.send({
      janus: "keepalive",
      session_id: this.sessionId,
    });
  }

  async destroySession() {
    clearInterval(this.timer);
    return this.transport.send({
      janus: "destroy",
    });
  }

  private startKeepAliveTimer() {
    this.timer = setInterval(async () => {
      await this.keepAlive();
    }, this.sessionTimeOut);
  }

  async attach<T extends JanusScalerClientPlugin>(classToCreate: new (...args: any) => T): Promise<T> {
    const handle = await this.transport.send({
      janus: "attach",
      plugin: (classToCreate as any).identifier,
      session_id: this.sessionId,
    });
    const plugin = new classToCreate(this.client,this.sharedState, handle.data.id, this, this.transport);
    plugin.webRTCStack=new JanusScalerWebRTCStack(this.client,this.sharedState,this,plugin);
    await plugin.webRTCStack?.init();
    return plugin;

  }
}
