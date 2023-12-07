<template>
  <div>home publish audio to room 123456</div>
</template>

<script setup>
import * as _ from "lodash";
import aigle from "aigle";
import { JanusScalerClient, JanusScalerClientStreamingPlugin, JanusScalerClientAudioBridgePlugin, JanusScalerWebsocketTransport } from "janus_scaler_client";
async function test() {
  const transport = new JanusScalerWebsocketTransport("ws://127.0.0.1:8188");
  const client = new JanusScalerClient(transport, { apiSecret: "janusscalerrocks" });
  const session = await client.createSession();
  const audioBridgePlugin = await session.attach(JanusScalerClientAudioBridgePlugin);
  // const streamingPlugin = await session.attach(JanusScalerClientStreamingPlugin);
  const roomCreated = await audioBridgePlugin.createRoom({ room: 123456 });
  await audioBridgePlugin.send({ request: "edit", groups: ["boomer"], room: 123456 });
  console.log(await audioBridgePlugin.send({ request: "list" }));
  // const audioBridgePc = new RTCPeerConnection();
  // const mediaSteam = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
  // mediaSteam.getTracks().forEach((track) => {
  //   audioBridgePc.addTrack(track);
  // });
  // const offer = await audioBridgePc.createOffer();
  // await audioBridgePc.setLocalDescription(offer);

  // const { plugindata } = await audioBridgePlugin.joinRoom({ room: 123456 });
  // const { joined, streamingMountPoints } = plugindata.data;
  // console.log(joined);
  // audioBridgePc.onicecandidate = async (event) => {
  //   await audioBridgePlugin.proxy(joined.node, {
  //     janus: "trickle",
  //     optionalProperties: {
  //       candidate: event.candidate,
  //     },
  //   });
  // };
  // const configureResponse = await audioBridgePlugin.configure(joined.node, {
  //   jsep: offer,
  // });
  // const { jsep } = configureResponse.plugindata.data;
  // await audioBridgePc.setRemoteDescription(jsep);
  // const mountPoints = await streamingPlugin.subscribeToMountPoints(streamingMountPoints);
  // console.log(mountPoints);
  // const mediaStream = new MediaStream();
  // await aigle.each(mountPoints, async ({ initiate, peerConnection }) => {
  //   peerConnection.ontrack = (ev) => {
  //     mediaStream.addTrack(ev.track);
  //     const audioContext = new AudioContext();
  //     const sourceNode = audioContext.createMediaStreamSource(mediaStream);
  //     sourceNode.connect(audioContext.destination);
  //     new Audio().srcObject = mediaStream;
  //   };
  //   await initiate(peerConnection);
  // });
}
test();
</script>

<style lang="scss" scoped></style>
