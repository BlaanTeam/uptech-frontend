<template>
  <v-app dark>
    <AuthNav />
    <AuthAppBar />
    <slot></slot>
  </v-app>
</template>

<script>
import AuthNav from "@/layouts/partials/AuthNav";
import AuthAppBar from "../components/Navigation/AuthAppBar";
export default {
  components: {
    AuthNav,
    AuthAppBar
  }
};
</script>
