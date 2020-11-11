import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dark: localStorage.getItem("dark") || false
  },
  getters: {
    isDark: state => !!state.dark
  },
  mutations: {
    setDark(state) {
      state.dark = !state.dark;
    }
  },
  actions: {
    setDark({ commit }, { val }) {
      localStorage.setItem("dark", val);
      commit["setDark"];
    }
  },
  modules: {}
});
