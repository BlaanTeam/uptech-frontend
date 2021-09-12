<template>
  <v-navigation-drawer
    :right="$vuetify.rtl === true"
    v-model="drawer"
    permanent
    app
    width="220px"
    class="auth-secondarybg"
  >
    <v-list-item class="px-2" :inactive="true">
      <!-- <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon> -->
      <v-list-item :inactive="true">
        <v-list-item-avatar>
          <v-img src="@/assets/images/avatar.svg"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-list-item>

    <v-list nav dense>
      <v-list-item-group>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          :to="item.href"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <template v-slot:append>
      <v-btn
        to="/settings"
        class="ms-6 mb-6 px-8 auth-secondarybg"
        elevation="0"
      >
        <v-icon size="20" left>mdi-cog</v-icon>
        Settings
      </v-btn>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      group: "",
      items: [
        { title: "Feeds", icon: "mdi-home", href: "/feeds" },
        { title: "Messages", icon: "mdi-message", href: "/messages" },
        { title: "Profile", icon: "mdi-account", href: "/profile" }
      ],
      mini: true
    };
  }
};
</script>
<style lang="scss">
.theme--light {
  .v-navigation-drawer {
    padding: 0;
    background: #f3d551;
    &__border {
      display: none;
    }
  }
  .v-navigation-drawer__border {
    display: block !important;
    background: #adadad !important;
  }
}
</style>
