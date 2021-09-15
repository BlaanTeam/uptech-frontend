export default [
  {
    path: "/feeds",
    name: "Feeds",
    component: () => import("@/views/Feeds/Feeds"),
    meta: {
      authRequired: true,
      title: "titles.feeds",
      keepAlive: true
    }
  },
  {
    path: "/post/:postId",
    name: "ViewPost",
    component: () => import("@/views/Posts/ViewPost"),
    meta: {
      authRequired: true,
      title: "titles.viewPost"
    }
  }
];
