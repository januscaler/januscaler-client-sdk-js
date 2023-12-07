import { createApp } from "vue";
import "./style.css";
import { createRouter, createWebHistory } from "vue-router";
import Home from "./pages/index.vue";
import TestStreaming from "./pages/streaming/testStreaming.vue";
import JoinAudioRoom from "./pages/audioBridge/joinRoom.vue";
import VideoRoomIndex from "./pages/videoRoom/index.vue";
import VideoRoomCreateRoom from "./pages/videoRoom/createRoom.vue";
import VideoRoomJoinRoom from "./pages/videoRoom/joinRoom.vue";
import VideoCall from "./pages/videoCall/register.vue";
import App from "./App.vue";
const routes = [
  {
    path: "/",
    component: Home,
    children: [
      { path: "streaming/testStreaming", component: TestStreaming },
      { path: "audioRoom/joinAudioRoom", component: JoinAudioRoom },
      { path: "videoCall/register", component: VideoCall },
      {
        path: "videoRoom",
        component: VideoRoomIndex,
        children: [
          {
            path: "createRoom",
            component: VideoRoomCreateRoom,
          },
          {
            path: "joinRoom",
            component: VideoRoomJoinRoom,
          },
        ],
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

createApp(App).use(router).mount("#app");
