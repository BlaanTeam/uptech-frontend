<template>
  <v-app-bar app height="50%" bg>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-toolbar-title>UpTech</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn text class="mr-2" @click="logout()">
      <v-icon left>mdi-logout</v-icon>
      logout
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar",
  methods: {
    logout() {
      this.$store.dispatch("destroySession");
    }
  }
};
</script>
<style scoped>
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff;
}
</style>
