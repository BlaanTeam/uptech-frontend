<template>
  <div class="header d-flex">
    <v-app-bar class="header__nav" flat>
      <!--------------- Brand area --------------->
      <div class="d-flex">
        <router-link class="logo" to="/">
          <v-icon x-large>mdi-baby-face</v-icon>
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
    <v-navigation-drawer
      :right="$vuetify.rtl === true"
      v-model="drawer"
      absolute
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
              <v-icon>mdi-login</v-icon>
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
export default {
  components: {
    DarkMode,
    Locale
  },
  data: () => ({
    // Links ----------------------
    drawer: false,
    group: ""
  }),
  computed: {
    auth() {
      return this.$route.name === "SignIn"
        ? this.$t("nav.signup")
        : this.$t("nav.signin");
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
  .router-link-exact-active:not(.login):not(.logo) {
    border-bottom: 2px solid #f5c908;
  }
}
</style>
