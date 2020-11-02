<template>
  <v-app dark>
    <Nav />
    <!-- <AppBar /> -->
    <slot></slot>
  </v-app>
</template>

<script>
import Nav from "@/layouts/partials/DefaultNav";
// import AppBar from "../components/Navigation/AppBar";
export default {
  components: {
    Nav
    // AppBar
  }
};
</script>
