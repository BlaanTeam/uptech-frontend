import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import patterns from "./store/patterns";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";
import i18n from "./i18n";
import Notifications from "vue-notification";

Vue.use(Notifications);
Vue.prototype.$theme = vuetify.framework.theme;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
