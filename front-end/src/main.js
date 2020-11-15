import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import patterns from "./store/patterns";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";
import i18n from "./i18n";
import Notifications from "vue-notification";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

Vue.use(Notifications);
Vue.use(Loading);

Vue.prototype.$theme = vuetify.framework.theme;
Vue.prototype.$pattern = patterns;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
