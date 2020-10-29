import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";
import DefaultLayout from "@/layouts/Default";

Vue.config.productionTip = false;

// register a golbal layout
Vue.component("Layout", DefaultLayout);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
