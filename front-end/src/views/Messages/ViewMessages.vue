<template>
  <div class="messages-container">
    <Conversations class="conversations" :conversations="items" />
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
    <router-view class="messages" :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Conversations from "@/components/Chat/Conversations.vue";
import NewConversation from "@/components/Chat/NewConversation.vue";

export default {
  components: { Conversations, NewConversation },
  data: () => ({
    items: [
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Camella cabello",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Debbie oien ",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Camella cabello",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?"
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
        title: "Debbie dorien ",
        subtitle:
          "We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
      },
      {
        avatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
        title: "Camella cabello",
        subtitle:
          "Have any ideas about what we should get Heidi for her birthday?"
      }
    ]
  })
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
