import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home/Home.vue";
import About from "../views/Home/About.vue";
import NotFound from "../views/Errors/NotFound.vue";
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
    component: About,
    meta: {
      title: "About Us"
    }
  },
  {
    path: "/sign_in",
    name: "SignIn",
    // component:,
    meta: {
      title: "Sign In"
    }
  },
  {
    path: "/sign_up",
    name: "SignUp",
    // component:,
    meta: {
      title: "Sing Up"
    }
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
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
