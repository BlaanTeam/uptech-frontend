import Home from "@/views/Home/Home.vue";

export default [
  {
    path: "/home",
    alias: "/",
    name: "Home",
    component: Home,
    meta: {
      authRequired: false,
      title: "titles.home"
    }
  },
  {
    path: "/about",
    name: "About",
    component: () => import("@/views/Home/About"),
    meta: {
      authRequired: false,
      title: "titles.about"
    }
  }
];
