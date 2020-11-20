import Vue from "vue";
import store from "../store";
import VueRouter from "vue-router";
import Home from "../views/Home/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      authRequired: false,
      title: "Home"
    }
  },
  {
    path: "/feeds",
    name: "Feeds",
    // component: Home,
    meta: {
      authRequired: true,
      title: "Feeds"
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/Home/About"),
    meta: {
      authRequired: false,
      title: "About Us"
    }
  },
  {
    path: "/sign_in",
    name: "SignIn",
    component: () => import("@/views/Auth/SignIn"),
    meta: {
      authRequired: false,
      title: "Sign In"
    }
  },
  {
    path: "/sign_up",
    name: "SignUp",
    component: () => import("@/views/Auth/SignUp"),
    meta: {
      authRequired: false,
      title: "Sing Up"
    }
  },
  {
    path: "/confirm_account/:token",
    name: "ConfirmAccount",
    component: () => import("@/views/Auth/ConfirmAccount"),
    meta: {
      authRequired: false,
      title: "Confirm Account"
    }
  },
  {
    path: "/forgot_password",
    name: "ForgotPassword",
    component: () => import("@/views/Auth/ForgotPassword"),
    meta: {
      authRequired: false,
      title: "Forgot Password"
    }
  },
  {
    path: "/resend_confirmation",
    name: "ResendConfirmation",
    component: () => import("@/views/Auth/ResendConfirmation"),
    meta: {
      authRequired: false,
      title: "Re-send Confirmation"
    }
  },
  {
    path: "/reset_password/:token",
    name: "ResetPassword",
    component: () => import("@/views/Auth/ResetPassword"),
    meta: {
      authRequired: false,
      title: "Reset Password"
    }
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("@/views/Errors/NotFound"),
    meta: {
      global: true,
      title: "Not Found"
    }
  }
];

const router = new VueRouter({
  mode: false,
  base: process.env.BASE_URL,
  routes
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    document.title = "UpTech | " + (to.meta.title || "Welcome");
  });
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (store.getters.isLoggedIn) {
      next();
    } else {
      next({
        name: "SignIn",
        query: {
          nextPath: to.path
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
