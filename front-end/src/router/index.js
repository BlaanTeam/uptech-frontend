import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/Home.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home"
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/Home/About"),
    meta: {
      title: "About Us"
    }
  },
  {
    path: "/sign_in",
    name: "SignIn",
    component: () => import("@/views/Auth/SignIn"),
    meta: {
      title: "Sign In"
    }
  },
  {
    path: "/sign_up",
    name: "SignUp",
    component: () => import("@/views/Auth/SignUp"),
    meta: {
      title: "Sing Up"
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

export default router;
