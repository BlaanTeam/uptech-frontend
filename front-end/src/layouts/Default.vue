<template>
  <v-app dark>
    <DefaultNav />
    <!-- <AppBar /> -->
    <slot></slot>
  </v-app>
</template>

<script>
import DefaultNav from "@/layouts/partials/DefaultNav";
import AuthNav from "@/layouts/partials/DefaultNav";

// import AppBar from "../components/Navigation/AppBar";
export default {
  components: {
    DefaultNav
    // AppBar
  }
};
</script>
