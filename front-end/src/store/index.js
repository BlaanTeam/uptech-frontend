import Vue from "vue";
import Vuex from "vuex";
import AuthModule from "./modules/AuthModule";
import PostModule from "./modules/PostModule";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    AuthModule,
    PostModule
  }
});
