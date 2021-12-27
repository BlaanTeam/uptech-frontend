<template>
  <div class="conversations bg pt-16">
    <div class="conversations__header bg">
      <div class="d-flex px-2 py-3">
        <v-btn
          v-if="$vuetify.breakpoint.mdAndDown"
          text
          icon
          width="35"
          height="35"
          @click="$store.state.drawer = !$store.state.drawer"
        >
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
        <h1 class="ms-4 ">{{ $t("chats") }}</h1>
        <div class="ms-auto me-4 align-self-center">
          <v-btn icon>
            <v-icon size="25">mdi-cog</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider />
    </div>
    <v-list class="conversations__container bg">
      <div
        v-for="conv in conversations"
        :key="conv._id"
        class="conv-list-item"
        :class="{ 'new-message': newMessage(conv.lastMessage) }"
      >
        <router-link :to="{ name: 'ViewMessages', params: { id: conv._id } }">
          <v-list-item class="py-2">
            <v-list-item-avatar>
              <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title
                class="mb-1 d-flex align-center"
                :class="{ 'primary--text': newMessage(conv.lastMessage) }"
              >
                <span>
                  {{ conv.user.profile.firstName }}
                  {{ conv.user.profile.lastName }}
                </span>
                <span class="caption font-weight-thin ms-2">
                  @{{ conv.user.userName }}
                </span>
              </v-list-item-title>
              <v-list-item-subtitle class="pa-0 ma-0">
                <span>
                  {{ conv.lastMessage.content }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </router-link>
        <div class="conv__date caption text--disabled">
          <timeago
            :converterOptions="{ addSuffix: false }"
            :datetime="conv.timestamp"
            :auto-update="60"
          />
        </div>
        <v-divider></v-divider>
      </div>
      <infinite-loading @infinite="loadConversations"> </infinite-loading>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "Conversations",
  methods: {
    async loadConversations($state) {
      try {
        let conversations = await this.$store.dispatch("getConversations");
        if (conversations.length) {
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
    newMessage(message) {
      return !message.read && message.userId != this.$store.getters.getUserId;
    }
  },
  computed: {
    conversations() {
      return this.$store.getters.conversations;
    }
  }
};
</script>

<style lang="scss">
.conversations__container {
  height: 90vh;
  overflow-y: auto;
}
.conversations__header {
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 72px !important;
  background: yellowgreen;
}
.conv-list-item {
  position: relative;
  .conv__date {
    position: absolute;
    bottom: 0;
    right: 5px;
  }
}
.theme--dark {
  .conv-list-item:not(.new-message):hover {
    background: hsla(228, 6%, 16%, 0.5) !important;
  }
  .new-message {
    background: #26272b !important;
  }
}
.theme--light {
  .conv-list-item:not(.new-message):hover {
    background: hsla(0, 0%, 93%, 0.6) !important;
  }
  .new-message {
    background: #eeeeee !important;
  }
}
</style>
