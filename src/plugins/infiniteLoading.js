import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";

Vue.use(InfiniteLoading, {
  props: { spinner: "spiral" },
  slots: {
    noMore: "",
    error: "Oops, Something went wrong please try again "
  }
});
