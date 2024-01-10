import { JanusScalerClient, SharedState } from "./JanusScalerClient";
import { JanusScalerClientPlugin } from "./JanusScalerClientPlugin";
import { JanusScalerClientSession } from "./JanusScalerClientSession";
import _ from "lodash";
export class JanusScalerWebRTCStack {
  constructor(protected client: JanusScalerClient, protected sharedState: SharedState, protected session: JanusScalerClientSession, protected plugin: JanusScalerClientPlugin) {}
  peerConnection: RTCPeerConnection;
  async init() {
    this.peerConnection = new RTCPeerConnection(this.sharedState.peerConnectionConfiguration);
    this.handleIceCandidates();
    this.handleOnTrack();
  }

  private handleIceCandidates() {
    this.peerConnection.onicecandidate = async (event) => {
      await this.plugin.trickle(event.candidate);
    };
  }

  private handleOnTrack() {
    this.peerConnection.ontrack = (event) => {
      console.log("Handling Remote Track", event);
      if (!event.streams) return;
      if (!event.track) return;
      // Notify about the new track event
      const mid = event.transceiver ? event.transceiver.mid : event.track.id;
      try {
        this.plugin.onTrack.next({
          track: event.track,
          mid,
          flowing: true,
          data: {
            reason: "created",
          },
        });
      } catch (e) {
        console.error("Error calling onremotetrack", e);
      }
      if (event.track.onended) return;
      let trackMutedTimeoutId: any = null;
      console.log("Adding onended callback to track:", event.track);
      event.track.onended = (ev: any) => {
        console.log("Remote track removed:", ev);
        clearTimeout(trackMutedTimeoutId);
        // Notify the application
        const transceivers = this.peerConnection ? this.peerConnection.getTransceivers() : null;
        const transceiver = transceivers ? transceivers.find((t) => t.receiver.track === ev.target) : null;
        const mid = transceiver ? transceiver.mid : ev.target.id;
        try {
          this.plugin.onTrack.next({
            track: event.target,
            mid,
            flowing: false,
            data: {
              reason: "ended",
            },
          });
        } catch (e) {
          console.error("Error calling onremotetrack on removal", e);
        }
      };
      event.track.onmute = (ev: any) => {
        console.log("Remote track muted:", ev);
        if (!trackMutedTimeoutId) {
          trackMutedTimeoutId = setTimeout(() => {
            console.log("Removing remote track");
            // Notify the application the track is gone
            const transceivers = this.peerConnection ? this.peerConnection.getTransceivers() : null;
            const transceiver = transceivers ? transceivers.find((t) => t.receiver.track === ev.target) : null;
            const mid = transceiver ? transceiver.mid : ev.target.id;
            try {
              this.plugin.onTrack.next({
                track: event.target,
                mid,
                flowing: false,
                data: {
                  reason: "mute",
                },
              });
            } catch (e) {
              console.error("Error calling onremotetrack on mute", e);
            }
            trackMutedTimeoutId = null;
            // Chrome seems to raise mute events only at multiples of 834ms;
            // we set the timeout to three times this value (rounded to 840ms)
          }, 3 * 840);
        }
      };
      event.track.onunmute = (ev: any) => {
        console.log("Remote track flowing again:", ev);
        if (trackMutedTimeoutId != null) {
          clearTimeout(trackMutedTimeoutId);
          trackMutedTimeoutId = null;
        } else {
          try {
            // Notify the application the track is back
            const transceivers = this.peerConnection ? this.peerConnection.getTransceivers() : null;
            const transceiver = transceivers ? transceivers.find((t) => t.receiver.track === ev.target) : null;
            const mid = transceiver ? transceiver.mid : ev.target.id;
            this.plugin.onTrack.next({
              track: event.target,
              mid,
              flowing: true,
              data: {
                reason: "unmute",
              },
            });
          } catch (e) {
            console.error("Error calling onremotetrack on unmute", e);
          }
        }
      };
    };
  }
}
