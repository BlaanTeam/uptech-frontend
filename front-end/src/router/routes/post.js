export default [
  {
    path: "/feeds",
    name: "Feeds",
    component: () => import("@/views/Feeds/Posts"),
    meta: {
      authRequired: true,
      title: "titles.feeds",
      keepAlive: true
    }
  },
  {
    path: "/post/:postId",
    name: "ViewPost",
    component: () => import("@/views/Templates/PostTemplate"),
    meta: {
      authRequired: true,
      title: "titles.viewPost"
    }
  }
];
