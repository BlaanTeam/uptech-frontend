<template>
  <v-app dark>
    <UnAuthNav />
    <slot></slot>
    <Footer />
  </v-app>
</template>

<script>
import UnAuthNav from "@/layouts/partials/UnAuthNav";
import Footer from "@/layouts/partials/Footer";

export default {
  components: {
    UnAuthNav,
    Footer
  }
};
</script>
