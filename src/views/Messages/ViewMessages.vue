<template>
  <div class="messages-container">
    <Conversations v-show="showConvs()" class="conversations" />
    <div
      v-if="!$route.params.id && !$vuetify.breakpoint.smAndDown"
      class="bg px-14 d-flex flex-column text-center justify-center"
    >
      <h2>You don’t have any selected conversation</h2>
      <h4 class="my-1">
        Select a conversation from your existing messages, or start a new one.
      </h4>
      <NewConversation />
    </div>
    <router-view
      v-show="showRouterView()"
      class="messages"
      :key="$route.fullPath"
    />
  </div>
</template>

<script>
import Conversations from "@/components/Chat/Conversations.vue";
import NewConversation from "@/components/Chat/NewConversation.vue";

export default {
  name: "ViewMessages",
  components: { Conversations, NewConversation },
  methods: {
    showRouterView() {
      if (document.documentElement.clientWidth <= 600 && !this.$route.params.id)
        return false;
      return true;
    },
    showConvs() {
      if (document.documentElement.clientWidth <= 600 && this.$route.params.id)
        return false;
      return true;
    }
  },
  mounted() {
    console.log(this);
    this.$store.state.MessagesModule.msgsCount = 0;
  }
};
</script>

<style lang="scss">
.messages-container {
  width: 100%;
  height: 100vh;
  max-width: 1096px;
  display: flex;
  @media screen and (max-width: 600px) {
    width: 100vw;
    max-width: 100vw;
  }
  .conversations {
    position: relative;
    max-width: 470px;
    width: 40%;
    height: 100vh;
    @media screen and (max-width: 600px) {
      width: 100vw;
      max-width: 100vw;
    }
  }
  .messages {
    width: 60%;
    height: 100vh;
    max-width: 730px;
    @media screen and (max-width: 600px) {
      width: 100vw;
      max-width: 100vw;
    }
  }
}
.theme--light .conversations {
  border-right: 1px solid #adadad !important;
}
.theme--dark .conversations {
  border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
}
</style>
