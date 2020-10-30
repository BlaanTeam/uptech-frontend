<template>
  <v-app dark>
    <Nav />
    <AppBar />
    <slot></slot>
  </v-app>
</template>

<script>
import Nav from "@/layouts/partials/Nav";
import AppBar from "../components/Navigation/AppBar";
export default {
  components: {
    Nav,
    AppBar
  }
};
</script>
