import Vue from "vue";
import Vuex from "vuex";
import Post from "./modules/Post";
import Auth from "./modules/Auth";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Auth,
    Post
  }
});
