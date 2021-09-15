<template>
  <div class="conversations bg pt-16">
    <div class="bg conversations__header">
      <div class="d-flex px-2 py-3">
        <!-- <img src="@/assets/images/avatar.svg" width="40" /> -->
        <h1 class="ms-4 ">Chats</h1>
        <div class="ms-auto me-4 align-self-center">
          <v-btn icon>
            <v-icon size="25">mdi-cog</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
    <v-list two-line class="bg" height="80%">
      <div
        v-for="(conv, i) in conversations"
        :key="conv._id"
        class="conv-list-item"
        :class="{ 'new-message': newMessage(conv.lastMessage) }"
      >
        <span v-if="generateConvIds(conv._id, i)"></span>
        <router-link :to="{ name: 'ViewMessages', params: { id: conv._id } }">
          <v-list-item class="py-1">
            <v-list-item-avatar>
              <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="mb-1">
                <span>
                  {{ conv.user.profile.firstName }}
                  {{ conv.user.profile.lastName }}
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
        <div class="float-right caption mt-n4 me-1 font-weight-light">
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

  sockets: {
    async message(data) {
      this.soundEffect.play();
      await this.$store.dispatch("receiveMessage", {
        convId: data._id,
        user: data.user,
        lastMessage: data.lastMessage
      });
      await this.$state.dispatch("incrMsgsCount");
    }
  },
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
    async generateConvIds(_id, index) {
      await this.$store.dispatch("generateConvIds", { _id, index });
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
.conversations__header {
  position: absolute;
  top: 0;
  width: 29.9%;
  z-index: 2;
}

.theme--dark {
  .conv-list-item:hover {
    background: #26272b !important;
  }
  .new-message {
    background: #26272b !important;
    .v-list-item {
      color: #f0a709 !important;
    }
  }
}
.theme--light {
  .conv-list-item:hover {
    background: #dbd9d9 !important;
  }
  .new-message {
    background: #dbd9d9 !important;
    .v-list-item {
      color: #f0a709 !important;
    }
  }
}
</style>
