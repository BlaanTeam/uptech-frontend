import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import patterns from "./store/patterns";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";
import "./plugins/timeago";
import i18n from "./plugins/i18n";
import Notifications from "vue-notification";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

const originalSetItem = localStorage.setItem;

localStorage.setItem = function(key, value) {
  const event = new Event("itemInserted");

  event.value = value;
  event.key = key;

  document.dispatchEvent(event);

  originalSetItem.apply(this, arguments);
};

const localStorageSetHandler = async function(e) {
  if (e.key == "access_token") {
    await store.dispatch("updateToken", { accessToken: e.value });
  }
};

document.addEventListener("itemInserted", localStorageSetHandler, false);

Vue.use(Notifications);
Vue.use(Loading);

Vue.prototype.$theme = vuetify.framework.theme;
Vue.prototype.$pattern = patterns;
Vue.config.productionTip = false;

new Vue({
  computed: {
    isLoggedIn: _ => store.getters.isLoggedIn
  },
  router,
  store,
  vuetify,
  i18n,
  watch: {
    isLoggedIn(newVal, oldVal) {
      if (newVal === false) {
        if (this.$route.name === "Feeds") {
          this.$router.push({ name: "Home" });
        } else if (this.$route.name !== "SignIn") {
          this.$router.push({ name: "Home" });
          this.$notify({
            group: "errors",
            type: "error",
            title: this.$t("globals.errors.authError"),
            text: this.$t("globals.errors.authorizationError")
          });
        }
      } else {
        if (this.$route.name !== "SignIn") {
          this.$router.push({ name: "Feeds" });
        }
      }
    }
  },
  render: h => h(App)
}).$mount("#app");
