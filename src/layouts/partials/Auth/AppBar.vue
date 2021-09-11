<template>
  <v-app-bar app class="auth-secondarybg" height="52px" flat>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
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
  }
}

.theme--dark .v-app-bar {
  border-bottom: 1px solid #4b4b4b !important;
}
</style>
