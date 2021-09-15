<template>
  <div class="notifications">
    <div v-for="(notif, i) in notifications" :key="i" class="conv-list-item">
      <router-link :to="getLink(notif)" class="d-flex align-center notif-item">
        <div class="d-flex pt-4 px-4 pb-3">
          <div class="mx-4">
            <v-icon color="primary" size="30">
              {{ icons[notif.notificationType] }}
            </v-icon>
          </div>
          <div class="d-flex flex-column">
            <PopoverProfile
              :index="notif._id"
              :userName="notif.sender.userName"
            >
              <router-link
                :to="{
                  name: 'ViewProfile',
                  params: { userName: notif.sender.userName }
                }"
              >
                <img src="@/assets/images/avatar.svg" width="30" alt="Avatar" />
              </router-link>
            </PopoverProfile>
            <span> </span>
            <div class="d-flex align-center">
              <span class="font-weight-bold me-1 underlined">
                <PopoverProfile
                  :index="notif._id"
                  :userName="notif.sender.userName"
                >
                  <router-link
                    :to="{
                      name: 'ViewProfile',
                      params: { userName: notif.sender.userName }
                    }"
                  >
                    {{ notif.sender.profile.firstName }}
                    {{ notif.sender.profile.lastName }}
                  </router-link>
                </PopoverProfile>
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
</template>

<script>
import PopoverProfile from "@/components/Post/PopoverProfile.vue";
export default {
  name: "Notifications",
  components: { PopoverProfile },
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
    },
    getLink(notif) {
      if (notif.notificationType == 0 || notif.notificationType == 1)
        return { name: "ViewPost", params: { postId: notif.postId } };
      if (notif.notificationType == 2)
        return {
          name: "ViewProfile",
          params: { userName: notif.sender.userName }
        };
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
  width: 48vw;
  min-height: 90.1vh;
  overflow: hidden;
  overflow-x: hidden;
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
