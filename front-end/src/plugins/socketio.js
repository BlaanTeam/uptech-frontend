import Vue from "vue";
import store from "../store";
import VueSocket from "vue-socket.io";
import io from "socket.io-client";
Vue.use(
  new VueSocket({
    debug: true,
    connection: io("wss://bdab-129-213-51-199.ngrok.io", {
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
