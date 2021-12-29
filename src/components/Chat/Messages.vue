<template>
  <div class="bg messages-box ms-auto">
    <v-card flat height="100%" class="bg messages-box__card">
      <v-card-title class="bg messages-box__header px-2 py-2 mb-1">
        <v-btn
          class="me-2"
          v-if="$vuetify.breakpoint.smAndDown"
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
        <router-link
          :to="{
            name: 'ViewProfile',
            params: { userName: user.userName }
          }"
          v-if="user"
          class="d-flex align-center"
        >
          <img src="@/assets/images/avatar.svg" width="40" class="me-2" />
          <span class="d-flex flex-column">
            <span class="subtitle-1 mt-n1">
              {{ user.profile.firstName + " " }}
              {{ user.profile.lastName }}
            </span>
            <span class="caption mt-n2"> @{{ user.userName }} </span>
          </span>
        </router-link>
        <div class="ms-auto">
          <v-btn icon class="me-4">
            <v-icon color="primary">mdi-phone-hangup</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="primary">mdi-video</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div
        v-if="user && user.blockedByViewer"
        class="d-flex flex-column messages-box__messages justify-center text-center bg"
      >
        <h2>You have been blocked this user</h2>
        <h4>Unblock to send messages</h4>
        <Unblock :userInfo="user">
          <v-btn elevation="0" class="text-capitalize mt-4" color="red" dark>
            <v-icon small left>mdi-lock-open-variant-outline</v-icon>
            unblock
          </v-btn>
        </Unblock>
      </div>
      <div
        v-else-if="user && user.hasBlockedViewer"
        class="d-flex flex-column messages-box__messages justify-center text-center bg"
      >
        <h2>You have been blocked from this user</h2>
        <h4>Sorry you can't send messages</h4>
      </div>
      <div v-else class="messages-box__messages__container">
        <v-card-text class="messages-box__messages d-flex px-6">
          <infinite-loading direction="top" @infinite="loadMessages">
          </infinite-loading>
          <div
            v-for="message in messages"
            :key="message._id"
            class="message__container"
            :id="'message' + message._id"
          >
            <Message :message="message" @unsend="unsent(message)" />
          </div>
          <div v-if="typing" class="ps-2">
            <Dots />
          </div>
        </v-card-text>
      </div>
      <v-card-actions class="px-0 messages-box__actions bg">
        <v-btn icon width="30" height="30" class="ms-1 mr-n2">
          <v-icon color="primary">mdi-plus-box</v-icon>
        </v-btn>
        <v-btn icon width="30" height="30">
          <v-icon color="primary">mdi-image</v-icon>
        </v-btn>
        <div class="d-flex justify-center me-n10" style="z-index: 2">
          <Emojis
            top
            attach=".messages-box__actions"
            element="sendMessageTextArea"
            :inputModel="content"
          />
        </div>
        <v-textarea
          id="sendMessageTextArea"
          class="px-0 py-0"
          hide-details
          autofocus
          rounded
          filled
          rows="1"
          auto-grow
          dense
          @input="emitTyping"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMessage()"
          v-model="content.value"
        />

        <v-btn class="mx-1" icon @click.prevent="sendMessage()">
          <v-icon color="primary">mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Emojis from "@/components/Emojis.vue";
import Dots from "@/components/Chat/DotsLoading";
import Message from "@/components/Chat/Message";

export default {
  name: "Messages",
  components: {
    Emojis,
    Dots,
    Message,
    Unblock: () => import("@/components/Profile/Unblock")
  },
  data: () => ({
    messages: [],
    user: null,
    convId: "",
    content: { value: "" },
    timeOutId: null,
    typing: false,
    createdAt: null
  }),
  sockets: {
    typing(data) {
      if (this.currentConvId === data.convId) {
        clearTimeout(this.timeOutId);
        this.typing = true;
        this.timeOutId = setTimeout(() => {
          this.typing = false;
        }, 2000);
      }
    },
    async message(data) {
      if (this.currentConvId === data._id) {
        data.isOwner = false;
        this.messages.push(data.lastMessage);
        this.scrollBottom();
      }
    }
  },
  computed: {
    currentConvId() {
      return this.$route.params.id;
    }
  },
  methods: {
    async loadMessages($state) {
      this.convId = this.$route.params.id;
      try {
        let res = await this.$store.dispatch("getMessages", {
          createdAt: this.createdAt,
          convId: this.convId
        });
        if (!this.user) {
          this.user = res.user;
          this.$set(this.user, "blockedByViewer", res.blockedByViewer);
          this.$set(this.user, "hasBlockedViewer", res.hasBlockedViewer);
        }
        if (res.messages.length) {
          let lastMessage = res.messages[0];
          this.createdAt = lastMessage.createdAt;
          this.messages.unshift(...res.messages);
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
    emitTyping() {
      this.$socket.emit("typing", {
        convId: this.convId,
        userId: this.user._id
      });
    },
    unsent(message) {
      const el = document.querySelector("#message" + message._id);
      el.setAttribute("data-delete", "true");
      el.style.transition = "all 0.5s ease-in-out";
      setTimeout(() => {
        el.remove();
        const index = this.messages.indexOf(message);
        this.messages.splice(index, 1);
      }, 500);
    },
    async sendMessage() {
      if (!this.content.value.trim()) return;
      if (this.user.blockedByViewer) return;
      if (this.user.hasBlockedViewer) return;
      this.content.value = this.content.value.trim();
      try {
        let message = {
          convId: this.convId,
          content: this.content.value,
          user: this.user,
          isOwner: true,
          read: false,
          sent: 1,
          createdAt: new Date().toISOString()
        };
        this.messages.push(message);
        const content = this.content.value;
        this.content.value = "";
        this.scrollBottom();
        let res = await this.$store.dispatch("sendMessage", {
          convId: this.convId,
          content,
          user: this.user
        });
        message._id = res.data._id;
        message.sent = 2;
      } catch (err) {
        console.log(err);
      }
    },
    scrollBottom() {
      let messagesContainer = document.querySelector(".messages-box__messages");
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  }
};
</script>

<style lang="scss">
.message__container[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
.messages-box__header {
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  height: 60px;
  width: 100%;
}
.messages-box {
  max-height: 100vh;
  &__messages__container {
    width: 100%;
    height: 82vh;
  }
  &__messages {
    width: 100%;
    height: 100%;
    flex-direction: column;
    padding: 0 0 30px 0;
    overflow-y: auto;
  }
  &__actions {
    box-shadow: 0px -3px 10px rgba(0, 0, 0, 0.2);
    position: absolute;
    bottom: 0;
    z-index: 5;
    width: 100%;
    #sendMessageTextArea {
      max-height: 100px;
      overflow-y: auto;
    }
    .v-input__slot {
      padding: 0 14px 2px 34px !important;
    }
  }
}
</style>
