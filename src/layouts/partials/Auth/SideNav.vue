<template>
  <v-navigation-drawer
    :right="$vuetify.rtl === true"
    v-model="drawer"
    permanent
    app
    width="300px"
    class="auth-secondarybg"
  >
    <v-list-item class="px-2 ms-4" :inactive="true">
      <v-list-item-avatar>
        <v-img src="@/assets/images/avatar.svg"></v-img>
      </v-list-item-avatar>
    </v-list-item>

    <div class="d-flex flex-column align-start justify-center ps-4">
      <span v-for="item in items" :key="item.title">
        <v-btn
          :to="item.href"
          text
          rounded
          class="mt-2 pa-5 secondary-bg text-none font-weight-regular"
        >
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
      </span>
    </div>

    <template v-slot:append>
      <v-btn
        to="/settings"
        class="mb-6 px-4 ms-4 auth-secondarybg"
        text
        rounded
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
        { title: "Feeds", icon: "mdi-home-outline", href: "/feeds" },
        { title: "Messages", icon: "mdi-message-outline", href: "/messages" },
        {
          title: "Notifications",
          icon: "mdi-bell-outline",
          href: "/notifications"
        },
        { title: "Profile", icon: "mdi-account-outline", href: "/profile" }
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
  .v-btn--active {
    .v-badge__badge {
      color: white !important;
    }
    &::before {
      background: unset !important;
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
