<template>
  <div>
    <router-link to="/">Home</router-link> | <router-link to="/streaming/testStreaming">Streaming</router-link> | <router-link to="/videoRoom">Video Room</router-link>| <router-link to="/audioRoom/joinAudioRoom">Audio Room</router-link> |
    <router-link to="/videoCall/register">VideoCall</router-link>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup>
// const adminWebsocket = new WebSocket("ws://0.0.0.0:7188", "admin-januscaler-protocol");
// adminWebsocket.onopen = () => {
//   adminWebsocket.send(JSON.stringify({ janus: "list_tokens", adminsecret: "janusscaleroverlord" }));
//   adminWebsocket.onmessage = (msg) => {
//     console.log(msg);
//   };
// };
</script>

<style lang="scss" scoped></style>
