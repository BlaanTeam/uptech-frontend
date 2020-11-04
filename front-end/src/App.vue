<template>
  <UnAuthLayout v-if="false">
    <v-main>
      <router-view></router-view>
    </v-main>
  </UnAuthLayout>
  <AuthLayout v-else>
    <v-main>
      <router-view></router-view>
    </v-main>
  </AuthLayout>
</template>

<script>
import UnAuthLayout from "./layouts/UnAuthLayout";
import AuthLayout from "@/layouts/AuthLayout";

export default {
  components: {
    UnAuthLayout,
    AuthLayout
  },
  name: "App"
};
</script>
<style lang="scss"></style>
