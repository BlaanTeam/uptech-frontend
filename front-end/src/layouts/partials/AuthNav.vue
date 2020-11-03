<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    permanent
    width="180"
    app
  >
    <v-layout
      align-center
      justify-space-between
      column
      fill-height
      @mouseleave.stop="mini = true"
    >
      <div>
        <v-list-item class="px-2">
          <v-app-bar-nav-icon @click="mini = !mini"></v-app-bar-nav-icon>
          <v-list-item-title class="pa-4">Up Tech</v-list-item-title>
        </v-list-item>

        <v-list nav dense>
          <v-list-item-group>
            <div v-for="(item, index) in navItemsTop" :key="index">
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-list-item
                    v-on="on"
                    :exact="item.href === '/'"
                    :to="item.href"
                    link
                  >
                    <v-list-item-action>
                      <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <span>{{ item.title }}</span>
              </v-tooltip>
            </div>
          </v-list-item-group>
        </v-list>
      </div>
      <v-list nav dense>
        <v-list-item-group>
          <div v-for="(item, index) in navItemsBottom" :key="index">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-list-item
                  v-on="on"
                  :exact="item.href === '/'"
                  :to="item.href"
                  tag="button"
                >
                  <v-list-item-action>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ item.title }}</span>
            </v-tooltip>
          </div>
        </v-list-item-group>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      mini: true,
      navItemsTop: [
        { title: "Home", icon: "mdi-home", href: "/" },
        {
          title: "About Us",
          icon: "mdi-account-group-outline",
          href: "/about"
        },
        { title: "Sign In", icon: "mdi-login", href: "/sign_in" },
        { title: "Sign Up", icon: "mdi-plus-box-multiple", href: "/sign_up" }
      ],
      navItemsBottom: [
        { title: "Settings", icon: "mdi-cog", href: "/settings" }
      ]
    };
  },
  methods: {
    sayHello() {
      console.log("Hello");
      return 1;
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
.theme--dark {
  .v-navigation-drawer {
    .v-list {
      .v-list-item--active {
        color: #f3d551;
      }
    }
  }
}
</style>
