export default [
  {
    path: "/profile/:userName",
    name: "ViewProfile",
    component: () => import("@/views/Profile/ViewProfile"),
    meta: {
      authRequired: true,
      title: "titles.viewProfile"
    }
  }
];
