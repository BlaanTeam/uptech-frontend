export default [
  {
    path: "/sign_in",
    name: "SignIn",
    component: () => import("@/views/Auth/SignIn"),
    meta: {
      authRequired: false,
      title: "titles.signin"
    }
  },
  {
    path: "/sign_up",
    name: "SignUp",
    component: () => import("@/views/Auth/SignUp"),
    meta: {
      authRequired: false,
      title: "titles.signup"
    }
  },
  {
    path: "/confirm_account/:token",
    name: "ConfirmAccount",
    component: () => import("@/views/Auth/ConfirmAccount"),
    meta: {
      authRequired: false,
      title: "titles.confirmAccount"
    }
  },
  {
    path: "/forgot_password",
    name: "ForgotPassword",
    component: () => import("@/views/Auth/ForgotPassword"),
    meta: {
      authRequired: false,
      title: "titles.forgotPassword"
    }
  },
  {
    path: "/resend_confirmation",
    name: "ResendConfirmation",
    component: () => import("@/views/Auth/ResendConfirmation"),
    meta: {
      authRequired: false,
      title: "titles.resendConfirmation"
    }
  },
  {
    path: "/reset_password/:userId/:token",
    name: "ResetPassword",
    component: () => import("@/views/Auth/ResetPassword"),
    meta: {
      authRequired: false,
      title: "titles.resetPassword"
    }
  }
];
