<template>
  <div>
    <div style="display: flex; flex-flow: row wrap">
      <video style="flex: 25%; width: 300px; height: auto; object-fit: contain" v-for="(stream, mediaId) in videoFeeds" :srcObject.camel="stream" :key="mediaId" autoplay controls></video>
    </div>
    <div v-show="false">
      <audio v-for="(stream, mediaId) in audioFeeds" :srcObject.camel="stream" :key="mediaId" autoplay controls></audio>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { JanusScalerClient, JanusScalerClientStreamingPlugin, JanusScalerWebsocketTransport } from "janus_scaler_client";
const videoFeeds = reactive<Record<any, MediaStream>>({});
const audioFeeds = reactive<Record<any, MediaStream>>({});
async function test() {
  // const adminClient = new JanusScalerClient(new JanusScalerWebsocketTransport("ws://127.0.0.1:7188", "januscaler-admin-protocol"), {
  //   adminSecret: "janusscaleroverlord",
  // });
  // const adminSession = await adminClient.getAdminSession();
  // await adminSession.addToken("mytoken");
  const client = new JanusScalerClient(new JanusScalerWebsocketTransport("ws://127.0.0.1:8188", "januscaler-protocol"), {
    apiSecret: "janusscalerrocks",
  });
  const session = await client.createSession();
  const streamingPlugin = await session.attach(JanusScalerClientStreamingPlugin);
  streamingPlugin.onMessage.subscribe(async ({ jsep }) => {
    if (jsep) {
      await streamingPlugin.handleRemoteJsep(jsep);
      const answer = await streamingPlugin.createAnswer();
      await streamingPlugin.start(answer);
    }
  });
  streamingPlugin.onTrack.subscribe(({ data, flowing, track, mid }) => {
    if (track.kind === "audio") {
      if (!audioFeeds[mid]) {
        const mediaSteam = new MediaStream([track]);
        audioFeeds[mid] = mediaSteam;
      }
    }
    if (track.kind === "video") {
      if (!videoFeeds[mid]) {
        const mediaSteam = new MediaStream([track]);
        videoFeeds[mid] = mediaSteam;
      } else {
        videoFeeds[mid].addTrack(track);
      }
    }
  });

  await streamingPlugin.watch({ id: 2 });
}
test();
</script>

<style lang="scss" scoped></style>
