<template>
  <div>Join Video Room</div>
  <div style="display: flex; flex-flow: row wrap">
    <video style="flex: 25%; width: 300px; height: auto; object-fit: contain" v-for="(stream, mediaId) in videoFeeds" :srcObject.camel="stream" :key="mediaId" autoplay controls></video>
  </div>
  <div v-show="false">
    <audio v-for="(stream, mediaId) in audioFeeds" :srcObject.camel="stream" :key="mediaId" autoplay controls></audio>
  </div>
  <button :disabled="!active" @click="leaveRoom">Leave</button>
  <button :disabled="!active" @click="screenShare">screenshare</button>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import * as _ from "lodash";
import { JanusScalerClient, JanusScalerClientSession, JanusScalerClientVideoRoomPlugin, JanusScalerWebsocketTransport } from "janus_scaler_client";
const videoRoomPlugin = ref<JanusScalerClientVideoRoomPlugin>();
const subscriberPlugin = ref<JanusScalerClientVideoRoomPlugin>();
const client = ref<JanusScalerClient>();
const active = ref(false);
const session = ref<JanusScalerClientSession>();
const transport = ref<JanusScalerWebsocketTransport>();
const mediaSteam = ref<MediaStream>();
const screenStream = ref<MediaStream>();
const videoFeeds = reactive<Record<any, MediaStream>>({});
const audioFeeds = reactive<Record<any, MediaStream>>({});
const midToFeedMap = reactive<Record<string, string>>({});
const feedStreams = reactive<Record<any, any>>({});
const subscriptions = reactive<Record<any, any>>({});
const room = 1234;
async function subscribeTo(streams: any[]) {
  if (streams.length == 0) {
    return;
  }
  if (!subscriberPlugin.value) {
    subscriberPlugin.value = await session.value?.attach(JanusScalerClientVideoRoomPlugin);
    const subscription: any = [];
    for (let streamSources of streams) {
      for (let stream of streamSources) {
        // If the publisher is VP8/VP9 and this is an older Safari, let's avoid video
        if (stream.disabled) {
          console.log("Disabled stream:", stream);
          // TODO Skipping for now, we should unsubscribe
          continue;
        }
        console.log("Subscribed to " + stream.id + "/" + stream.mid + "?", subscriptions);
        if (subscriptions?.[stream.id]?.[stream.mid]) {
          console.log("Already subscribed to stream, skipping:", stream);
          continue;
        }

        subscription.push({
          feed: stream.id, // This is mandatory
          mid: stream.mid, // This is optional (all streams, if missing)
        });
        if (!subscriptions[stream.id]) subscriptions[stream.id] = {};
        subscriptions[stream.id][stream.mid] = true;
      }
    }

    subscriberPlugin.value?.onTrack.subscribe(({ track, mid, flowing }) => {
      const feed = midToFeedMap[mid];
      console.log(feed);
      const mediaId = feed + mid;
      console.log(mediaId);
      if (track.kind === "audio") {
        if (!audioFeeds[mediaId]) {
          const mediaSteam = new MediaStream([track]);
          audioFeeds[mediaId] = mediaSteam;
        }
      }
      if (track.kind === "video") {
        if (!videoFeeds[mediaId]) {
          const mediaSteam = new MediaStream([track]);
          videoFeeds[mediaId] = mediaSteam;
        } else {
          videoFeeds[mediaId].addTrack(track);
        }
      }
    });
    subscriberPlugin.value?.onMessage.subscribe(async ({ message, jsep }) => {
      if (jsep) {
        console.log("subscriber offer", jsep);
        await subscriberPlugin.value?.handleRemoteJsep(jsep);
        const answer = await subscriberPlugin.value?.createAnswer();
        console.log("answer is", answer);
        await subscriberPlugin.value?.send({ request: "start" }, answer);
      }
    });
    await subscriberPlugin.value?.joinRoom({ ptype: "subscriber", room, streams: subscription });
    return;
  }

  let added: any = undefined;
  let removed: any = undefined;
  for (let streamsArray of streams) {
    for (let stream of streamsArray) {
      console.log(stream);
      // If the publisher is VP8/VP9 and this is an older Safari, let's avoid video
      if (stream.disabled) {
        console.log("Disabled stream:", stream);
        if (!removed) removed = [];
        // Unsubscribe
        removed.push({
          feed: stream.id, // This is mandatory
          mid: stream.mid, // This is optional (all streams, if missing)
        });
        delete subscriptions[stream.id][stream.mid];
        continue;
      }
      if (subscriptions[stream.id] && subscriptions[stream.id][stream.mid]) {
        console.log("Already subscribed to stream, skipping:", stream);
        continue;
      }
      if (!added) added = [];
      // Subscribe
      added.push({
        feed: stream.id, // This is mandatory
        mid: stream.mid, // This is optional (all streams, if missing)
      });
      if (!subscriptions[stream.id]) subscriptions[stream.id] = {};
      subscriptions[stream.id][stream.mid] = true;
    }
  }
  if ((!added || added.length === 0) && (!removed || removed.length === 0)) {
    // Nothing to do
    return;
  }
  const update: any = { request: "update" };
  if (_.size(added)) update.subscribe = added;
  if (_.size(removed)) update.unsubscribe = removed;
  await subscriberPlugin.value?.send(update);
}
async function leaveRoom() {
  active.value = false;
  mediaSteam.value?.getTracks().forEach((track) => {
    track.stop();
  });
  screenStream.value?.getTracks().forEach((track) => {
    track.stop();
  });
  await videoRoomPlugin.value?.leave();
  await subscriberPlugin.value?.leave();
  _.each(_.keys(videoFeeds), (key) => {
    delete videoFeeds[key];
  });
  _.each(_.keys(audioFeeds), (key) => {
    delete audioFeeds[key];
  });
}
async function screenShare() {
  screenStream.value = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true });
  screenStream.value.getTracks().forEach((track) => {
    videoRoomPlugin.value?.webRTCStack?.peerConnection.addTrack(track);
  });
  const offer = await videoRoomPlugin.value?.createOffer();
  await videoRoomPlugin.value?.configure({ descriptions: [{ mid: "2", description: "screenshare" }] }, offer);
}

async function test() {
  transport.value = new JanusScalerWebsocketTransport("ws://127.0.0.1:8188");
  client.value = new JanusScalerClient(transport.value, { apiSecret: "janusscalerrocks" });
  session.value = await client.value.createSession();
  videoRoomPlugin.value = await session.value.attach(JanusScalerClientVideoRoomPlugin);

  videoRoomPlugin.value.onMessage.subscribe(async ({ message, jsep }) => {
    console.log(message);
    const event = message.videoroom;
    if (event === "joined") {
      const offer = await videoRoomPlugin.value?.createOffer();
      await videoRoomPlugin.value?.configure({ descriptions: [{ mid: "0", description: "video" }] }, offer);
    }
    if (message["leaving"]) {
      // One of the publishers has gone away?
      const leaving = message["leaving"];
      console.log("Publisher left: " + leaving);
      await unsubscribeFrom(leaving);
    }
    if (message.publishers) {
      let sources: any[] = [];
      const publishers = [...message.publishers];
      for (const publisher of publishers) {
        const { id, display, streams, dummy } = publisher;
        if (dummy) continue;
        for (const stream of streams) {
          stream.id = id;
          stream.display = display;
          midToFeedMap[stream.mid] = id;
        }
        feedStreams[id] = {
          id: id,
          display: display,
          streams: streams,
          remoteVideos: feedStreams[id] ?? 0,
        };
        sources.push(streams);
        console.log(sources);
        await subscribeTo(sources);
      }
    }
    if (jsep) {
      await videoRoomPlugin.value?.handleRemoteJsep(jsep);
    }
  });
  await videoRoomPlugin.value.send({
    request: "create",
    room,
    publishers: 500,
  });
  mediaSteam.value = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  mediaSteam.value.getTracks().forEach((track) => {
    videoRoomPlugin.value?.webRTCStack?.peerConnection.addTrack(track);
  });
  await videoRoomPlugin.value.joinRoom({ room, display: "test", ptype: "publisher" });
  active.value = true;
}

async function unsubscribeFrom(id) {
  // Unsubscribe from this publisher
  const feed = feedStreams[id];
  console.log(feed);
  if (!feed) return;
  console.debug("Feed " + id + " (" + feed.display + ") has left the room, detaching");
  delete feedStreams[id];
  delete videoFeeds[id];
  delete audioFeeds[id];
  // Send an unsubscribe request
  if (subscriberPlugin.value != null)
    await subscriberPlugin.value.send({
      request: "unsubscribe",
      streams: [{ feed: id }],
    });
  delete subscriptions[id];
}
onMounted(async () => {
  await test();
});
</script>

<style scoped></style>
