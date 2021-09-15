<template>
  <v-app dark>
    <SideNav />
    <slot></slot>
  </v-app>
</template>

<script>
import SideNav from "./partials/Auth/SideNav";
export default {
  components: {
    SideNav
  }
};
</script>
