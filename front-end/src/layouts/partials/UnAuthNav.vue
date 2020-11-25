<template>
  <div class="header d-flex">
    <v-app-bar class="header__nav" flat>
      <!--------------- Brand area --------------->
      <div class="d-flex">
        <h1>Brand</h1>
      </div>
      <v-spacer></v-spacer>
      <!------------------ Links for computer devices -------------------->
      <div class="d-none d-sm-flex links ">
        <router-link to="/">
          <v-btn text>
            {{ $t("nav.home") }}
          </v-btn>
        </router-link>
        <router-link to="/about">
          <v-btn text>
            {{ $t("nav.about") }}
          </v-btn>
        </router-link>
        <router-link to="/support">
          <v-btn text>
            {{ $t("nav.support") }}
          </v-btn>
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <DarkMode />
      <Locale />
      <router-link class="login d-none d-sm-flex" :to="router">
        <v-btn color="primary" rounded elevation="0" dark>
          <v-icon left>mdi-login</v-icon>
          {{ auth }}
        </v-btn>
      </router-link>
      <!---------------- button for mobile devices ------------------------>
      <v-btn icon @click="drawer = true" class="d-sm-none d-flex float-right">
        <v-icon large>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- navigation drawer on mobile version -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item v-for="(link, i) in links" :key="i" :to="link.href">
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.name }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/login">
            <v-btn>
              <v-icon left>mdi-login</v-icon>
              Login
            </v-btn>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script defer>
import DarkMode from "@/components/DarkMode";
import Locale from "@/components/Locale.vue";
export default {
  components: {
    DarkMode,
    Locale
  },
  data: () => ({
    // Links ----------------------
    links: [
      { name: "Home", href: "/", icon: "mdi-home" },
      { name: "About", href: "/about", icon: "mdi-information" },
      { name: "Support", href: "/Support", icon: "mdi-account-hard-hat" }
    ],
    drawer: false,
    group: ""
  }),
  computed: {
    auth() {
      return this.$route.name === "SignIn" ? "register" : "login";
    },
    router() {
      return this.$route.name === "SignIn" ? "/sign_up" : "/sign_in";
    }
  }
};
</script>
<style lang="scss">
.header {
  &__nav {
    background: inherit !important;
  }
  .router-link-exact-active:not(.login) {
    border-bottom: 2px solid #f5c908;
    // border-radius: 10px;
  }
}
</style>
