import Vue from "vue";
import store from "../store";
import VueSocket from "vue-socket.io";
import io from "socket.io-client";
let baseURL = `${process.env.VUE_APP_WS}://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`;
Vue.use(
  new VueSocket({
    debug: process.env.NODE_ENV == "development" ? true : false,
    connection: io(baseURL, {
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
