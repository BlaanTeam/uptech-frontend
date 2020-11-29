import Vue from "vue";
import axios from "axios";
import i18n from "./i18n";

axios.defaults.baseURL = "http://localhost:5000/api/v1/";

// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
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
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = axios;
