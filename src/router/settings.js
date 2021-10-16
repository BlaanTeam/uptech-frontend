import Settings from "@/views/Settings/Settings.vue";

export default [
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: {
      authRequired: true,
      title: "titles.settings"
    }
  }
];
