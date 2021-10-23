import Vue from "vue";
import axios from "axios";
import i18n from "./i18n";
import store from "../store/index";

let baseURL = `${process.env.VUE_APP_API_SCHEME}://${process.env.VUE_APP_API_HOST}:${process.env.VUE_APP_API_PORT}`;
axios.defaults.baseURL = `${baseURL}/api/v1`;

axios.defaults.validateStatus = status => status >= 200 && status < 399;

// Add a request interceptor
axios.interceptors.request.use(
  async function(config) {
    // Do something before request is sent
    let accessToken = await store.getters.getToken;
    let isLoggedIn = store.getters.isLoggedIn;
    if (isLoggedIn === true) {
      config.headers.common["x-auth-token"] = accessToken;
      return config;
    } else {
      if (isLoggedIn === true) {
        store.dispatch("destroySession");
        Vue.prototype.$notify({
          group: "errors",
          type: "error",
          title: i18n.t("globals.errors.authError"),
          text: i18n.t("globals.errors.authorizationError")
        });
      }
      return config;
    }
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    if (!error.response) {
      Vue.prototype.$notify({
        group: "errors",
        type: "error",
        title: i18n.t("globals.errors.connectionError"),
        text: i18n.t("globals.errors.lostConnection")
      });
      return Promise.reject(error);
    }
    if (error.response.status === 404 && store.getters.isLoggedIn) {
      store.dispatch("handleNotFound");
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      if (store.getters.isLoggedIn) store.dispatch("destroySession");

      Vue.prototype.$notify({
        group: "errors",
        type: "error",
        title: i18n.t("globals.errors.authError"),
        text: i18n.t("globals.errors.authorizationError")
      });
      return Promise.reject(error);
    }

    Vue.prototype.$notify({
      group: "errors",
      type: "error",
      title: "",
      text: i18n.t("globals.errors.unknownError")
    });

    return Promise.reject(error);
  }
);

Vue.prototype.$http = axios;
export default axios;
