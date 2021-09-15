<template>
  <v-app-bar app flat class="auth-secondarybg" height="52px" width="48vw">
    <v-toolbar-title>UpTech</v-toolbar-title>
    <v-spacer></v-spacer>
    <DarkMode />
    <Locale />
    <v-btn text class="mr-2" @click.prevent="logout()">
      <v-icon left>mdi-logout</v-icon>
      logout
    </v-btn>
  </v-app-bar>
</template>

<script>
import DarkMode from "@/components/DarkMode";
import Locale from "@/components/Locale";
export default {
  components: { DarkMode, Locale },

  name: "AppBar",
  methods: {
    async logout() {
      this.$socket.close();
      await this.$store.dispatch("destroySession");
    }
  }
};
</script>
<style scoped lang="scss">
.theme--light {
  .v-app-bar.v-toolbar.v-sheet {
    background-color: #fff;
  }
  .v-app-bar {
    border-bottom: 1px solid #adadad !important;
    border-right: 1px solid #adadad !important;
  }
}

.theme--dark .v-app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
