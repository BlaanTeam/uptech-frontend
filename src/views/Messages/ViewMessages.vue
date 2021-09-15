<template>
  <div class="messages-container">
    <Conversations class="conversations" />
    <div
      v-if="!$route.params.id"
      class="chat-box mx-auto px-10 d-flex flex-column justify-center align-center"
    >
      <h2>You don’t have any selected conversation</h2>
      <h4 class="my-1">
        Select a conversation from your existing messages, or start a new one.
      </h4>
      <NewConversation />
    </div>
    <keep-alive v-else>
      <router-view class="messages" :key="$route.fullPath"></router-view>
    </keep-alive>
    <v-divider vertical />
  </div>
</template>

<script>
import Conversations from "@/components/Chat/Conversations.vue";
import NewConversation from "@/components/Chat/NewConversation.vue";

export default {
  name: "ViewMessages",
  components: { Conversations, NewConversation }
};
</script>

<style lang="scss">
.messages-container {
  width: 80vw;
  height: 100vh;
  max-width: 1050px;
  display: flex;
  .conversations {
    position: relative;
    width: 36%;
    height: 100vh;
    overflow-y: auto;
    border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
  }
  .messages {
    width: 64%;
    height: 100vh;
  }
}
.theme--light .conversations {
  border-right: 1px solid #adadad !important;
}

.theme--dark .conversations {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
.theme--light .messages {
  border-right: 1px solid #adadad !important;
}

.theme--dark .messages {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
