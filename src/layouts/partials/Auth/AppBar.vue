<template>
  <v-app-bar flat app class="auth-secondarybg app-bar" height="52px">
    <v-btn
      v-if="$vuetify.breakpoint.mdAndDown"
      text
      icon
      width="35"
      height="35"
      @click="$store.state.drawer = !$store.state.drawer"
    >
      <v-icon>
        mdi-menu
      </v-icon>
    </v-btn>

    <v-toolbar-title class="text-capitalize">{{
      $route.path.split("/")[1]
    }}</v-toolbar-title>
    <DarkMode v-show="false" />
    <v-spacer></v-spacer>
    <v-menu nudge-right="10" offset-y left :close-on-content-click="false">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on" class="px-0 rounded-pill">
          <img src="@/assets/images/avatar.svg" width="30" />
          <v-icon> mdi-chevron-down </v-icon>
        </v-btn>
      </template>
      <div
        class="auth-secondarybg d-flex flex-column pt-2 px-2"
        style="width: 170px"
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
        <v-divider class="mt-14" />
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
  top: unset !important;
  width: 45vw;
  max-width: 610px !important;
}
.theme--light {
  .app-bar .v-toolbar .v-sheet {
    background-color: #fff;
  }
  .app-bar {
    border-bottom: 1px solid #adadad !important;
  }
}
.theme--dark .app-bar {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
