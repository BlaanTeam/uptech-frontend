<template>
  <v-navigation-drawer v-model="drawer" mini-variant permanent app width="180">
    <v-layout align-center justify-space-between column fill-height>
      <div>
        <v-list-item class="px-2">
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </v-list-item>

        <v-list nav dense>
          <v-list-item-group>
            <div
              v-for="(item, index) in items"
              :key="index"
              v-show="item.href != '/about_us'"
            >
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
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-list-item to="/settings" link v-on="on">
              <v-list-item-icon>
                <v-icon>mdi-cog</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Settings</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Settings</span>
        </v-tooltip>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { title: "Home", icon: "mdi-home", href: "/" },
        {
          title: "About Us",
          icon: "mdi-account-group-outline",
          href: "/about"
        },
        { title: "Sign In", icon: "mdi-login", href: "/sign_in" },
        { title: "Sign Up", icon: "mdi-plus-box-multiple", href: "/sign_up" }
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
