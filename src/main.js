import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";
import "./plugins/axios";
import "./plugins/timeago";
import "./plugins/socketio";
import "./plugins/infiniteLoading";
import "./plugins/notification";
import "./plugins/emojiPicker";
import "./utils";

Vue.prototype.soundEffect = new Audio(
  "https://static.xx.fbcdn.net/rsrc.php/yy/r/XFhtdTsftOC.ogg"
);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
