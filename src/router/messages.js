export default [
  {
    path: "/messages",
    name: "Messages",
    component: () => import("@/views/Messages/ViewMessages.vue"),
    meta: {
      authRequired: true,
      title: "Chat"
    },
    children: [
      {
        path: ":id",
        name: "ViewMessages",
        component: () => import("@/components/Chat/Messages.vue"),
        meta: {
          title: "Chat"
        }
      }
    ]
  }
];
