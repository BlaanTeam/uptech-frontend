<template>
  <DefaultLayout v-if="true">
    <v-main>
      <router-view></router-view>
    </v-main>
  </DefaultLayout>
  <UserLayout v-else>
    <v-main>
      <router-view></router-view>
    </v-main>
  </UserLayout>
</template>

<script>
import DefaultLayout from "@/layouts/Default";
import UserLayout from "@/layouts/User";

export default {
  components: {
    DefaultLayout,
    UserLayout
  },
  name: "App"
};
</script>
<style lang="scss"></style>
