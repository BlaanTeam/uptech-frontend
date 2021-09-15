<template>
  <div class="notifications">
    <div class="notifications__content bg">
      <div v-for="(notif, i) in notifications" :key="i" class="conv-list-item">
        <router-link to="#" class="d-flex align-center notif-item">
          <div class="d-flex pt-4 px-4 pb-3">
            <div class="mx-4">
              <v-icon color="primary" size="30">
                {{ icons[notif.notificationType] }}
              </v-icon>
            </div>
            <div class="d-flex flex-column">
              <span>
                <img src="@/assets/images/avatar.svg" width="30" alt="Avatar" />
              </span>
              <div class="d-flex align-center">
                <span class="font-weight-bold me-1">
                  {{ notif.sender.profile.firstName }}
                  {{ notif.sender.profile.lastName }}
                </span>
                <span>
                  {{ text[notif.notificationType] }}
                </span>
              </div>
            </div>
          </div>
        </router-link>
        <v-divider />
      </div>
      <infinite-loading @infinite="loadNotifications"> </infinite-loading>
    </div>
    <v-divider vertical />
  </div>
</template>

<script>
export default {
  data: () => ({
    icons: [
      "mdi-heart-outline",
      "mdi-comment-outline",
      "mdi-account-outline",
      "mdi-bullhorn-outline"
    ],
    text: [
      "liked your post",
      "commented on you post",
      "followed you",
      "published a new announcement"
    ]
  }),
  methods: {
    async loadNotifications($state) {
      try {
        let notifications = await this.$store.dispatch("getNotifications");
        console.log(notifications);
        if (notifications.length) {
          $state.loaded();
        } else {
          $state.loaded();
          $state.complete();
        }
      } catch (err) {
        $state.error();
        console.log(err);
      }
    }
  },
  computed: {
    notifications() {
      return this.$store.getters.notifications;
    }
  }
};
</script>

<style lang="scss">
.notifications {
  max-width: 50vw;
  min-height: 90.1vh;
  display: flex;
  &__content {
    width: 100%;
    overflow: hidden;
    overflow-x: hidden;
  }
}
.theme--dark {
  .notif-item:hover {
    background: #26272b !important;
  }
}
.theme--light {
  .notif-item:hover {
    background: #dbd9d9 !important;
  }
}
</style>
