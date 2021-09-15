export default [
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("@/views/Notifications/Notifications"),
    meta: {
      authRequired: true,
      title: "titles.notifications"
    }
  }
];
