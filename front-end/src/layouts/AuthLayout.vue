<template>
  <v-app dark>
    <SideNav />
    <AppBar />
    <slot></slot>
  </v-app>
</template>

<script>
import SideNav from "./partials/Auth/SideNav";
import AppBar from "./partials/Auth/AppBar";
export default {
  components: {
    SideNav,
    AppBar
  }
};
</script>
