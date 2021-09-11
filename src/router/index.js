import Vue from "vue";
import i18n from "../plugins/i18n";
import store from "../store";
import VueRouter from "vue-router";

import home from "./home";
import auth from "./auth";
import post from "./post";
import profile from "./profile";
import messages from "./messages";

Vue.use(VueRouter);

const t = (key, params) => i18n.t(key, { ...params });

const routes = [
  ...home,
  ...auth,
  ...post,
  ...profile,
  ...messages,
  {
    path: "/not_found",
    alias: "*",
    name: "NotFound",
    component: () => import("@/views/Errors/NotFound"),
    meta: {
      global: true,
      title: "titles.notFound"
    }
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = `${t("appName")} | ${t(to.meta.title, to.params)}`;
  });
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (store.getters.isLoggedIn) {
      next();
    } else {
      next({
        name: "SignIn",
        params: to.params,
        query: {
          nextPath: to.name
        }
      });
    }
  } else if (to.matched.some(record => record.meta.global)) {
    next();
  } else {
    if (store.getters.isLoggedIn) {
      next({
        name: "Feeds"
      });
    } else {
      next();
    }
  }
});
export default router;
