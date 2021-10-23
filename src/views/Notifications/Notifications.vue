<template>
  <div class="notifications bg">
    <div v-for="(notif, i) in notifications" :key="i" class="conv-list-item">
      <div
        @click="handleClick($event, notif)"
        class="d-flex align-center notif-item"
        :class="{ 'unread-notif': !notif.isRead }"
      >
        <div class="d-flex pt-4 px-4 pb-3">
          <div class="mx-4">
            <v-icon color="primary" size="30">
              {{ icons[notif.notifType] }}
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
                    {{ notif.sender.userName }}
                  </router-link>
                </PopoverProfile>
              </span>
              <span>
                {{ text[notif.notifType] }}
              </span>
            </div>
          </div>
        </div>
      </div>
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
    ]
  }),
  methods: {
    async loadNotifications($state) {
      try {
        let notifications = await this.$store.dispatch("getNotifications");
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
      if (notif.notifType == 0 || notif.notifType == 1)
        return { name: "ViewPost", params: { postId: notif.postId } };
      if (notif.notifType == 2)
        return {
          name: "ViewProfile",
          params: { userName: notif.sender.userName }
        };
    },
    async handleClick(e, notif) {
      if (e.target.nodeName != "DIV") return;
      await this.$http.patch("/notifications/" + notif._id);
      if (!notif.isRead) await this.$store.dispatch("decrNotifsCount");
      await this.$router.push(this.getLink(notif));
      notif.isRead = true;
    }
  },
  computed: {
    notifications() {
      return this.$store.getters.notifications;
    },
    text() {
      return this.$t("notificationsAlert");
    }
  }
};
</script>

<style lang="scss">
.notifications {
  overflow: hidden;
  overflow-x: hidden;
  .conv-list-item {
    cursor: pointer;
  }
}
.theme--dark {
  .notif-item:hover {
    background: #26272b !important;
  }
  .unread-notif {
    background: #28292e !important;
  }
}
.theme--light {
  .notif-item:hover {
    background: #dbd9d9 !important;
  }
  .unread-notif {
    background: #f3f3f3 !important;
  }
}
</style>
