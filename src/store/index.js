import Vue from "vue";
import Vuex from "vuex";
import AuthModule from "./modules/AuthModule";
import PostModule from "./modules/PostModule";
import SocketModule from "./modules/SocketModule";
import MessagesModule from "./modules/MessagesModule";
import NotificationsModule from "./modules/NotificationsModule";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawer: false
  },
  modules: {
    AuthModule,
    PostModule,
    SocketModule,
    MessagesModule,
    NotificationsModule
  }
});
