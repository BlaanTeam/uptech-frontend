<template>
  <div class="messages-box ms-auto">
    <v-card flat height="100%" class="bg messages-box__card">
      <v-card-title class="bg messages-box__header px-6">
        <div class="d-flex align-center">
          <img src="@/assets/images/avatar.svg" width="40" class="me-2" />
          <h1 class="title" v-if="user">
            {{ user.userName + " " }}
            {{ user.profile.firstName }}
          </h1>
        </div>
        <div class="ms-auto">
          <v-btn icon class="me-4">
            <v-icon color="primary">mdi-phone-hangup</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="primary">mdi-video</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-text class="bg messages-box__messages d-flex pt-4 px-8">
        <div v-for="message in messages" :key="message.id">
          <div
            v-if="message.isOwner"
            class="messages-box__messages__sent message primary darken-2"
          >
            <p>{{ message.content }}</p>
          </div>

          <div
            v-else
            class="messages-box__messages__received message secondarybg darken-1"
          >
            <p>{{ message.content }}</p>
          </div>
        </div>
        <div v-if="typing" class="ps-2">
          <Dots />
        </div>
      </v-card-text>
      <v-card-actions class="messages-box__actions bg px-6">
        <v-btn icon>
          <v-icon color="primary">mdi-plus-box</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon color="primary">mdi-image</v-icon>
        </v-btn>
        <v-textarea
          id="sendMessageTextArea"
          class="mx-4"
          hide-details
          autofocus
          rounded
          filled
          auto-grow
          dense
          :rows="1"
          @input="emitTyping"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMessage()"
          v-model="content.value"
        ></v-textarea>
        <div class="ms-n14">
          <Emojis
            left
            top
            attach=".messages-box__actions"
            element="sendMessageTextArea"
            :inputModel="content"
          />
        </div>
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

export default {
  name: "messages-boxbox",
  components: { Emojis, Dots },
  data: () => ({
    messages: [],
    user: null,
    convId: "",
    content: { value: "" },
    timeOutId: null,
    typing: false,
    id: 0
  }),
  sockets: {
    typing(data) {
      console.log("typing");
      clearTimeout(this.timeOutId);
      this.typing = true;
      this.timeOutId = setTimeout(() => {
        this.typing = false;
      }, 2000);
    },
    message(data) {
      data.isOwner = false;
      this.messages.push(data);
      this.scrollBottom();
    }
  },
  methods: {
    emitTyping() {
      this.$socket.emit("typing", {
        convId: this.convId,
        userId: this.user._id
      });
    },
    async sendMessage() {
      try {
        let res = await this.$store.dispatch("sendMessage", {
          convId: this.convId,
          content: this.content.value
        });
        res.data.isOwner = true;
        this.messages.push(res.data);
        this.scrollBottom();
      } catch (err) {
        console.log(err);
      }

      this.content.value = "";
    },
    scrollBottom() {
      let messagesContainer = document.querySelector(".messages-box__messages");
      setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }, 0);
    }
  },
  async created() {
    this.convId = this.$route.params.id;
    try {
      let res = await this.$http.get(`/chats/${this.convId}/messages`);
      console.log(res);
      this.messages = res.data.messages;
      this.user = res.data.user;
    } catch (err) {
      console.log(err);
    }
  },
  mounted() {
    this.scrollBottom();
  }
};
</script>

<style lang="scss">
.messages-box__header {
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  z-index: 2;
  width: 100%;
}
.messages-box {
  &__card {
    padding-top: 64px;
  }
  &__messages {
    height: 90%;
    flex-direction: column;
    padding: 30px 10px;
    overflow-y: auto;
    .message {
      clear: both;
      padding: 10px;
      max-width: 70%;
      margin: 4px 0;
      p {
        margin: 0;
      }
    }
    &__received {
      border-radius: 0 10px 10px 10px;
      float: left;
    }
    &__sent {
      border-radius: 10px 0 10px 10px;
      float: right;
      color: #d8d8d8;
    }
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
  }
}
</style>
