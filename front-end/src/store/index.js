import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    accessToken: localStorage.getItem("access_token") || "",
    user: localStorage.getItem("user") || {}
  },
  getters: {
    isLoggedIn: state =>
      !!state.accessToken &&
      !!state.accessToken.match(Vue.prototype.$pattern.jwtToken)
  },
  mutations: {
    AUTH_SUCCESS: (state, payload) => {
      localStorage.setItem("access_token", payload.accessToken);
      localStorage.setItem("user", payload.user);
      state.accessToken = payload.accessToken;
      state.user = payload.user;
    }
  },
  actions: {
    signIn: (context, payload) => {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/auth/sign_in", payload)
          .then(res => {
            if (res.status === 200 && res.data.code === 2032) {
              context.commit("AUTH_SUCCESS", {
                accessToken: res.data.accessToken,
                user: {}
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
          .post("/auth/sign_up", payload)
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
          .post("/auth/confirm_account", payload)
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
          .post("/auth/forgot_password", payload)
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
          .post("/auth/reset_password", payload)
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
          .post("/auth/resend_confirmation", payload)
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  },
  modules: {}
});
