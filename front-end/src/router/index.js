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
    path: "/test",
    name: "test",
    // component: () => import("@/views/Auth/SignUp"),
    meta: {
      authRequired: true,
      title: "Dashboard"
    }
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("@/views/Errors/NotFound"),
    meta: {
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
  } else next();
  // else {
  //   if (store.getters.isLoggedIn) {
  //     next({
  //       name: "test"
  //     });
  //   } else {
  //     next();
  //   }
  // }
});
export default router;
