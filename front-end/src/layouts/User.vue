<template>
  <v-app dark>
    <Nav />
    <AppBar />
    <slot></slot>
  </v-app>
</template>

<script>
import Nav from "@/layouts/partials/UserNav";
import AppBar from "../components/Navigation/UserAppBar";
export default {
  components: {
    Nav,
    AppBar
  }
};
</script>
