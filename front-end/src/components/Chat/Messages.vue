<template>
  <div class="messages-box ms-auto">
    <v-card flat height="100%" class="bg messages-box__card">
      <v-card-title class="bg messages-box__header px-6">
        <div class="d-flex align-center">
          <img src="@/assets/images/avatar.svg" width="40" class="me-2" />
          <h1 class="title">Jhon doe</h1>
          <h3 class="mx-1">{{ parseInt(id) + 1 }}</h3>
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

      <v-card-text class="bg messages-box__messages d-flex">
        <div v-for="item in $store.getters.currentMessages" :key="item.id">
          <div
            v-if="item.received"
            class="messages-box__messages__received message secondarybg darken-1"
          >
            <p>{{ item.received }}</p>
          </div>
          <div
            v-if="item.sent"
            class="messages-box__messages__sent message primary darken-2"
          >
            <p>{{ item.sent }}</p>
          </div>
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
          @keydown.enter.exact.prevent
          @keyup.enter.exact="send()"
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
        <v-btn class="mx-1" icon>
          <v-icon color="primary">mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import Emojis from "@/components/Emojis.vue";

export default {
  name: "messages-boxbox",
  components: { Emojis },
  data: () => ({
    content: { value: "" },
    id: 0
  }),
  methods: {
    send() {
      this.content.value = "";
    }
  },
  mounted() {
    this.id = this.$route.params.id;
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
