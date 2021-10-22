<template>
  <div class="header d-flex">
    <v-app-bar class="header__nav px-md-10" flat>
      <!--------------- Brand area --------------->
      <div class="d-flex">
        <router-link class="logo d-flex align-center" to="/">
          <Logo width="32" />
          <span class="ms-2 logo__text">UpTech</span>
        </router-link>
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
      <router-link class="login d-none d-sm-flex ms-2" :to="router">
        <v-btn color="primary" rounded elevation="0" dark>
          <v-icon left size="20">mdi-{{ auth.icon }}</v-icon>
          {{ auth.name }}
        </v-btn>
      </router-link>
      <!---------------- button for mobile devices ------------------------>
      <v-btn icon @click="drawer = true" class="d-sm-none d-flex float-right">
        <v-icon large>mdi-menu</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- navigation drawer on mobile version -->
    <v-navigation-drawer
      class="bg"
      :right="$vuetify.rtl === true"
      v-model="drawer"
      fixed
      temporary
    >
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("nav.home") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("nav.about") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/support">
            <v-list-item-icon>
              <v-icon>mdi-account-hard-hat</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("nav.support") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/sign_in">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("nav.signin") }}</v-list-item-title>
          </v-list-item>
          <v-list-item to="/sign_up">
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ $t("nav.signup") }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script defer>
import DarkMode from "@/components/DarkMode";
import Locale from "@/components/Locale.vue";
import Logo from "@/components/svg/Logo.vue";

export default {
  name: "Nav",
  components: { DarkMode, Locale, Logo },
  data: () => ({
    // Links ----------------------
    drawer: false,
    group: ""
  }),
  computed: {
    auth() {
      return this.$route.name === "SignIn"
        ? { name: this.$t("nav.signup"), icon: "account-plus" }
        : { name: this.$t("nav.signin"), icon: "login" };
    },
    router() {
      return this.$route.name === "SignIn" ? "/sign_up" : "/sign_in";
    }
  }
};
</script>
<style lang="scss">
.logo__text {
  font-family: "Pacifico", cursive;
}
.header {
  &__nav {
    background: inherit !important;
  }
  .router-link-exact-active:not(.login):not(.logo) {
    border-bottom: 2px solid #f5c908;
  }
}
</style>
