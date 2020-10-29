<template>
  <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
    <v-list-item class="px-2" :inactive="true">
      <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>
      <v-list-item :inactive="true" v-if="!mini">
        <v-list-item-avatar>
          <v-img src="@/assets/images/avatar.svg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>{{ username() }}</v-list-item-title>
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
        <v-list-item link to="/settings">
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      group: "",
      items: [
        { title: "Home", icon: "mdi-home-city", href: "/" },
        { title: "My Account", icon: "mdi-account", href: "account" },
        { title: "Users", icon: "mdi-account-group-outline", href: "/users" }
      ],
      mini: true,
      user: {
        logedIn: () => false,
        username: "oumoussa"
      }
    };
  },
  methods: {
    username() {
      return this.user.logedIn() ? this.user.username : "Avatar";
    }
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
    .v-list {
      .v-list-item--active {
        // text-align: center;
        // border-radius: 14px;
        // background: #ffffff;
      }
    }
  }
}
</style>
