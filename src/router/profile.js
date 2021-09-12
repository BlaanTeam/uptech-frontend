export default [
  {
    path: "/profile",
    component: () => import("@/views/Profile/Profile"),
    name: "Profile",
    meta: {
      authRequired: true,
      title: "titles.Profile"
    },
    children: [
      {
        path: "",
        name: "Profile",
        component: () => import("@/views/Profile/ViewProfile"),
        meta: {
          authRequired: true,
          title: "titles.viewProfile"
        }
      },
      {
        path: ":userName",
        name: "ViewProfile",
        component: () => import("@/views/Profile/ViewProfile"),
        meta: {
          authRequired: true,
          title: "titles.viewProfile"
        }
      }
    ]
  }
];
