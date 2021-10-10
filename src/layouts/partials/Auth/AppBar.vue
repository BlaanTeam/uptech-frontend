<template>
  <v-app-bar flat app class="auth-secondarybg app-bar" height="52px">
    <v-toolbar-title class="text-capitalize">{{
      $route.path.split("/")[1]
    }}</v-toolbar-title>
    <DarkMode v-show="false" />
    <v-spacer></v-spacer>
    <v-menu offset-y left :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on" class="px-0 rounded-pill">
          <img src="@/assets/images/avatar.svg" width="30" />
          <v-icon> mdi-chevron-down </v-icon>
        </v-btn>
      </template>
      <div
        class="auth-secondarybg d-flex flex-column px-4 pt-4"
        style="width: 200px"
      >
        <div class="ms-2 pb-2 d-block">
          <span class="float-left">Theme</span>
          <span class="float-right">
            <DarkMode />
          </span>
        </div>
        <v-divider />
        <div class="pt-2 ms-2 d-block">
          <span class="float-left mt-1">Language</span>
          <span class="float-right ms-2">
            <Locale />
          </span>
        </div>
        <v-divider class="mt-10" />
        <v-btn
          text
          class="d-flex justify-center align-center text-none"
          color="red"
          @click.prevent="logout()"
        >
          <v-icon left>mdi-logout</v-icon>
          logout
        </v-btn>
      </div>
    </v-menu>
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
.app-bar {
  left: unset !important;
  right: unset !important;
  width: 50vw;
  max-width: 700px !important;
}
.theme--light {
  .app-bar .v-toolbar .v-sheet {
    background-color: #fff;
  }
  .app-bar {
    border-bottom: 1px solid #adadad !important;
    border-right: 1px solid #adadad !important;
  }
}

.theme--dark .app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
