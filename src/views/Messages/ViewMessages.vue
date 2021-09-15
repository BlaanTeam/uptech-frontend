<template>
  <div class="messages-container">
    <Conversations class="conversations" />
    <v-divider vertical></v-divider>
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
    <keep-alive>
      <router-view class="messages" :key="$route.fullPath"></router-view>
    </keep-alive>
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
  height: 91.9vh;
  display: flex;
  .conversations {
    width: 30%;
    height: 100%;
    overflow-y: auto;
  }
  .messages {
    width: 70%;
    height: 91.9vh;
  }
}
</style>
