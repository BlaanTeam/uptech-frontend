<template>
  <v-app-bar flat app class="auth-secondarybg search" height="52px">
    <v-toolbar-title>{{ $t("appName") }}</v-toolbar-title>
    <v-spacer></v-spacer>
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
.search {
  left: unset !important;
  right: unset !important;
  width: 30vw;
  max-width: 500px !important;
}
.theme--light {
  .search .v-toolbar .v-sheet {
    background-color: #fff;
  }
  .search {
    border-bottom: 1px solid #adadad !important;
    border-right: 1px solid #adadad !important;
  }
}

.theme--dark .search {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
