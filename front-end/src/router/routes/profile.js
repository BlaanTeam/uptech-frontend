export default [
  {
    path: "/profile/",
    component: () => import("@/views/Profile/Main"),
    meta: {
      authRequired: true
    },
    children: [
      {
        path: "",
        name: "MyProfile",
        component: () => import("@/views/Profile/MyProfile"),
        meta: {
          authRequired: true,
          title: "titles.myProfile"
        }
      },
      {
        path: ":userId",
        name: "ViewProfile",
        component: () => import("@/views/Templates/ProfileTemplate"),
        meta: {
          authRequired: true,
          title: "titles.viewProfile",
          userName: "Unknown"
        },
        props: true
      }
    ]
  }
];
