import Vue from "vue";
import router from "../../router/index";

export default {
  state: {
    accessToken: localStorage.getItem("access_token") || "",
    user: JSON.parse(localStorage.getItem("user")) || {}
  },
  getters: {
    isLoggedIn: state =>
      !!state.accessToken &&
      !!state.accessToken.match(Vue.prototype.$pattern.jwtToken),
    getToken: state => state.accessToken,
    getUserId: state => state.user._id,
    getUserName: state => state.user.userName,
    user: state => state.user
  },
  mutations: {
    AUTH_SUCCESS: (state, payload) => {
      localStorage.setItem("access_token", payload.accessToken);
      localStorage.setItem("user", JSON.stringify(payload.user));
      state.accessToken = payload.accessToken;
      state.user = payload.user;
    },
    DESTROY_SESSION: state => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
    UPDATE_TOKEN: (state, accessToken) => {
      state.accessToken = accessToken;
    },
    UPDATE_USER_DATA: (state, data) => {
      state.user = data;
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  actions: {
    signIn: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/sign-in", payload)
          .then(res => {
            if (res.status === 200) {
              context.commit("AUTH_SUCCESS", {
                accessToken: res.data.accessToken,
                user: res.data.user
              });
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    signUp: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/sign-up", payload)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    confirmAccount: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/confirm-account", payload)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    forgotPassword: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/forgot-password", payload)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    resetPassword: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post(`/auth/reset-password/${payload.userId}/${payload.token}`, {
            password: payload.password
          })
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    resendConfirmation: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/resend-confirmation", payload)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateUserData: async (context, payload) => {
      await context.commit("UPDATE_USER_DATA", payload);
    },
    destroySession: async context => {
      await context.commit("DESTROY_SESSION");
      window.location.reload();
    },
    async handleNotFound() {
      await router.push({ name: "NotFound" });
    }
  }
};
