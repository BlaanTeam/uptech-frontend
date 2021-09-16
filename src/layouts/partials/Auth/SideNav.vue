<template>
  <v-navigation-drawer
    :right="$vuetify.rtl === true"
    v-model="drawer"
    permanent
    app
    width="300px"
    class="auth-secondarybg"
  >
    <div class="d-flex ms-9 my-5">
      <router-link to="/" class="d-flex align-center">
        <v-img src="@/assets/logo.png" width="35" />
        <span class="ms-2">Uptech</span>
      </router-link>
    </div>

    <div class="d-flex flex-column align-start justify-center ms-6">
      <span v-for="item in items" :key="item.title">
        <router-link :to="item.href">
          <v-btn text rounded class="mt-3 px-4 py-1 text-capitalize">
            <v-badge
              v-if="item.title == 'Messages' && msgsCount"
              color="primary"
              :content="msgsCount"
              left
            >
              <v-icon left size="24" class="me-4">{{ item.icon }}</v-icon>
            </v-badge>
            <v-badge
              v-else-if="item.title == 'Notifications' && notifCount"
              color="primary"
              :content="notifCount"
              left
            >
              <v-icon left size="24" class="me-4">{{ item.icon }}</v-icon>
            </v-badge>
            <v-icon v-else left size="24" class="me-4">{{ item.icon }}</v-icon>
            {{ item.title }}
          </v-btn>
        </router-link>
      </span>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      group: "",
      items: [
        { title: "Feeds", icon: "mdi-home-outline", href: "/feeds" },
        { title: "Messages", icon: "mdi-message-outline", href: "/messages" },
        {
          title: "Notifications",
          icon: "mdi-bell-outline",
          href: "/notifications"
        },
        { title: "Profile", icon: "mdi-account-outline", href: "/profile" },
        { title: "Settings", icon: "mdi-cog-outline", href: "/settings" }
      ],
      mini: true
    };
  },
  computed: {
    msgsCount() {
      return this.$store.getters.msgsCount <= 9
        ? this.$store.getters.msgsCount
        : "9+";
    },
    notifCount() {
      return this.$store.getters.notifCount <= 9
        ? this.$store.getters.notifCount
        : "9+";
    }
  }
};
</script>
<style lang="scss">
.v-navigation-drawer {
  left: unset !important;
  right: unset !important;
  .router-link-exact-active {
    .v-badge__badge {
      color: white !important;
    }
    span {
      color: #f0a709 !important;
    }
  }
}
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
