import Vue from "vue";
import VueTimeago from "vue-timeago";

Vue.use(VueTimeago, {
  name: "timeago", // Component name, `timeago` by default
  locale: "en", // Default locale
  // We use `date-fns` under the hood
  // So you can use all locales from it
  locales: {
    en: require("date-fns/locale/en"),
    ar: require("date-fns/locale/ar")
  }
});
