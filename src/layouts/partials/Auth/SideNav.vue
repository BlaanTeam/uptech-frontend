<template>
  <v-navigation-drawer
    :right="$vuetify.rtl === true"
    v-model="$store.state.drawer"
    :permanent="!$vuetify.breakpoint.mdAndDown"
    app
    class="auth-secondarybg"
  >
    <div class="d-flex ms-9 my-5">
      <router-link to="/" class="d-flex align-center">
        <Logo width="32" />
        <span class="ms-2">UpTech</span>
      </router-link>
    </div>

    <div class="d-flex flex-column align-start justify-center ms-6">
      <span v-for="item in items" :key="item.title">
        <router-link :to="item.href">
          <v-btn text rounded class="mt-3 px-4 py-1 text-capitalize">
            <v-badge
              v-if="item.title == 'Messages' && msgsCount == 'socket'"
              color="primary"
              left
              offset-x="-4"
              dot
            >
              <v-icon left size="24" class="me-4">{{ item.icon }}</v-icon>
            </v-badge>
            <v-badge
              v-else-if="item.title == 'Messages' && msgsCount"
              color="primary"
              :content="msgsCount <= 9 ? msgsCount : '9+'"
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
import Logo from "@/components/svg/Logo.vue";
export default {
  name: "SideNav",
  components: { Logo },
  data() {
    return {
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
      ]
    };
  },
  computed: {
    msgsCount() {
      return this.$store.getters.msgsCount;
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
  width: 40vw !important;
  max-width: 256px !important;
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
    display: none !important;
  }
}
.theme--dark {
  .v-navigation-drawer__border {
    display: none !important;
  }
}
</style>
