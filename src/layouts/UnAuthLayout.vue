<template>
  <v-app dark class="unauth-layout">
    <Nav />
    <slot></slot>
    <Footer />
  </v-app>
</template>

<script>
import Nav from "./partials/UnAuth/Nav";
import Footer from "./partials/UnAuth/Footer";

export default {
  components: {
    Nav,
    Footer
  }
};
</script>
