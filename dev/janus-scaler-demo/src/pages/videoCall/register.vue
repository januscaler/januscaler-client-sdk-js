<template>
  <div>home publish audio to room 123456</div>
</template>

<script setup>
import * as _ from "lodash";
import { JanusScalerClient, JanusScalerClientVideoCallPlugin, JanusScalerWebsocketTransport } from "janus_scaler_client";
async function test() {
  const transport = new JanusScalerWebsocketTransport("ws://127.0.0.1:8188");
  const client = new JanusScalerClient(transport, { apiSecret: "janusscalerrocks" });
  const session = await client.createSession();
  const videoCallPlugin = await session.attach(JanusScalerClientVideoCallPlugin);
  console.log(await videoCallPlugin.register("hello"));
}
test();
</script>

<style lang="scss" scoped></style>
