import Vue from "vue";
import store from "../store";
import VueSocket from "vue-socket.io";
import io from "socket.io-client";
let baseURL = `${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`;
Vue.use(
  new VueSocket({
    debug: true,
    connection: io(`ws://${baseURL}`, {
      autoConnect: false,
      extraHeaders: {
        "x-auth-token": store.getters.getToken
      }
    }),
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_"
    }
  })
);
