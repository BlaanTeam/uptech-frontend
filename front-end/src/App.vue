<template>
  <UnAuthLayout
    v-if="true"
    :style="{ background: $vuetify.theme.currentTheme.bg }"
  >
    <v-main>
      <router-view></router-view>
    </v-main>
  </UnAuthLayout>
  <AuthLayout v-else :style="{ background: $vuetify.theme.currentTheme.bg }">
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
<style lang="scss">
a {
  text-decoration: none;
}
</style>
