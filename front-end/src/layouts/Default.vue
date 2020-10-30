<template>
  <v-app dark>
    <Nav />
    <slot></slot>
  </v-app>
</template>

<script>
import Nav from "@/layouts/partials/Nav";
export default {
  components: {
    Nav
  }
};
</script>

<style></style>
