import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import patterns from "./store/patterns";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "./plugins/axios";
import "./plugins/timeago";
import "./plugins/socketio";
import i18n from "./plugins/i18n";
import Notifications from "vue-notification";
import VEmojiPicker from "v-emoji-picker";
import parseBody from "./plugins/parsePost";
import InfiniteLoading from "vue-infinite-loading";
import VueVirtualScroller from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";

Vue.use(VueVirtualScroller);

Vue.use(InfiniteLoading, {
  props: { spinner: "spiral" },
  slots: {
    noMore: "",
    error: "Oops, Something went wrong please try again "
  }
});

Vue.mixin({
  methods: {
    parseBody: parseBody
  }
});

Vue.use(Notifications);
Vue.use(VEmojiPicker);

Vue.prototype.$theme = vuetify.framework.theme;
Vue.prototype.$pattern = patterns;
Vue.config.productionTip = false;
new Vue({
  computed: {
    isLoggedIn: () => store.getters.isLoggedIn
  },
  router,
  store,
  vuetify,
  i18n,
  mounted() {
    if (this.isLoggedIn === true) {
      this.$socket.io.opts.extraHeaders[
        "x-auth-token"
      ] = this.$store.getters.getToken;
      this.$socket.open();
    }
  },
  watch: {
    isLoggedIn(newVal, oldVal) {
      if (newVal === true) {
        this.$socket.io.opts.extraHeaders[
          "x-auth-token"
        ] = this.$store.getters.getToken;
        this.$socket.open();
      }
    }
  },
  render: h => h(App)
}).$mount("#app");
