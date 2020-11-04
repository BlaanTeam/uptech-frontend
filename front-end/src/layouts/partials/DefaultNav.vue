<template>
  <div class="header white--text">
    <v-app-bar dark color="#1e3a46" flat>
      <!--------------- Brand area --------------->
      <v-layout class="d-flex">
        <h1>UpTech</h1>
      </v-layout>
      <!------------------ Links for computer devices -------------------->
      <v-layout class="d-none d-sm-flex links">
        <router-link v-for="link in links" :key="link.name" :to="link.href">
          <v-btn text>
            {{ link.name }}
          </v-btn>
        </router-link>
      </v-layout>
      <v-spacer class="d-sm-none d-flex"></v-spacer>
      <router-link class="d-none d-sm-flex" to="/login">
        <v-btn color="#d68605" rounded elevation="0" dark>
          <v-icon left>mdi-login</v-icon>
          Login
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
export default {
  data: () => ({
    // Links ----------------------
    links: [
      { name: "Home", href: "/", icon: "mdi-home" },
      { name: "About", href: "/about", icon: "mdi-information" },
      { name: "Support", href: "/Support", icon: "mdi-account-hard-hat" }
    ],
    drawer: false,
    group: ""
  })
};
</script>
<style lang="scss">
.header {
  .router-link-exact-active {
    border-bottom: 2px solid #f5c908;
    // border-radius: 10px;
  }
}
</style>
