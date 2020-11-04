<template>
  <v-app dark>
    <UnAuthNav />
    <slot></slot>
  </v-app>
</template>

<script>
import UnAuthNav from "@/layouts/partials/UnAuthNav";
export default {
  components: {
    UnAuthNav
  }
};
</script>
