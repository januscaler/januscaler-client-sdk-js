<template>
  <div>Create Video Room</div>
</template>

<script setup>
import { onMounted } from "vue";
import * as _ from "lodash";
import aigle from "aigle";
import { JanusScalerClient, JanusScalerClientVideoRoomPlugin, JanusScalerWebsocketTransport } from "janus_scaler_client";
async function test() {
  const client = new JanusScalerClient(new JanusScalerWebsocketTransport("ws://127.0.0.1:8188"));
  const session = await client.createSession();
  const videoRoomPlugin = await session.attach(JanusScalerClientVideoRoomPlugin);
  //   setInterval(async () => {
  console.log(
    await videoRoomPlugin.send({
      request: "create",
      room: 123456,
    })
  );
  // console.log(
  //   await videoRoomPlugin.send({
  //     request: "destroy",
  //     room: 123456,
  //   })
  // );
  //   }, 2000);
}
onMounted(async () => {
  await test();
});
</script>

<style scoped></style>
