<template>
  <div>
    <notifications :duration="10000" position="bottom right" group="errors">
    </notifications>
    <notifications :duration="10000" position="bottom left" group="success">
    </notifications>

    <UnAuthLayout
      v-if="!$store.getters.isLoggedIn"
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
  </div>
</template>

<script>
import UnAuthLayout from "./layouts/UnAuthLayout";
import AuthLayout from "@/layouts/AuthLayout";

export default {
  name: "App",
  components: {
    UnAuthLayout,
    AuthLayout
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      document.title = `${this.$t("appName")} | ${this.$t(
        this.$route.meta.title
      )}`;
    }
  }
};
</script>
<style lang="scss">
a {
  text-decoration: none;
  color: white;
}
main {
  min-height: 100vh;
}
.v-application a {
  color: inherit !important;
}
</style>
