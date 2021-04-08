<template>
  <div class="conversations bg pt-16">
    <div class="bg conversations__header">
      <div class="d-flex px-2 py-3">
        <img src="@/assets/images/avatar.svg" width="40" />
        <h1 class="ms-4 ">Chats</h1>
        <div class="ms-auto me-4 align-self-center">
          <v-btn icon>
            <v-icon size="25">mdi-cog</v-icon>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
    </div>
    <v-list class="bg " height="80%">
      <v-list-item-group dense>
        <div v-for="conv in conversations" :key="conv._id">
          <router-link :to="{ name: 'ViewMessages', params: { id: conv._id } }">
            <v-list-item class="py-1">
              <v-list-item-avatar>
                <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="mb-1">
                  <span>{{ conv.user.userName }}</span>
                  <span class="ms-1">{{ conv.user.profile.lastName }}</span>
                </v-list-item-title>
                <v-list-item-subtitle class="pa-0 ma-0">
                  <span>
                    {{ conv.lastMessage.content }}
                  </span>
                  <timeago
                    class="float-right"
                    :datetime="conv.timestamp"
                    :auto-update="60"
                  />
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-divider></v-divider>
        </div>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "Conversations",

  computed: {
    conversations() {
      return this.$store.getters.conversations;
    }
  },
  created() {
    let res = this.$store.dispatch("getConversations");
  }
};
</script>

<style>
.conversations__header {
  position: absolute;
  top: 0;
  width: 30%;
  z-index: 2;
}
</style>
