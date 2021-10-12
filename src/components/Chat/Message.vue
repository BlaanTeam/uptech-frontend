<template>
  <div
    @mouseenter="Menu = true"
    @mouseleave="Menu = false"
    v-if="message.isOwner"
    class="message message__sent"
    :data-read="!message.read"
  >
    <div class="message__sent__state ms-1" v-if="!deleted">
      <v-icon v-if="messageSent" small>mdi-check</v-icon>
      <v-icon color="teal" v-if="message.read" small>mdi-check-all</v-icon>
    </div>
    <div
      class="message__sent__content primary"
      :class="{ 'lighten-1 bg me-5': deleted, 'darken-2': !deleted }"
    >
      {{ message.content }}
    </div>
    <div class="message__sent__menu mx-1">
      <span v-show="Menu"
        ><MessageMenu :message="message" @unsent="deleted = true"
      /></span>
    </div>
  </div>

  <div
    v-else
    @mouseenter="Menu = true"
    @mouseleave="Menu = false"
    class="message message__received"
  >
    <div class="message__received__content secondarybg darken-1">
      {{ message.content }}
    </div>
  </div>
</template>

<script>
import MessageMenu from "./MessageMenu";
export default {
  name: "Message",
  components: { MessageMenu },
  data: () => ({
    Menu: false,
    deleted: false
  }),
  props: {
    message: { type: Object, required: true }
  },
  sockets: {
    read(data) {
      if (data.messageId === this.message._id && this.message.isOwner) {
        this.message.read = true;
      }
    }
  },
  computed: {
    messageSent() {
      return (
        (!this.message.read && !this.message.sent) ||
        (!this.message.read && this.message.sent == 2)
      );
    }
  },

  async mounted() {
    if (!this.message.isOwner) {
      await this.$socket.emit("mark-read", {
        userId: this.$store.getters.getUserId,
        messageId: this.message._id
      });
      await this.$store.dispatch("markRead", { convId: this.$route.params.id });
    }
  }
};
</script>

<style lang="scss">
.message {
  clear: both;
  margin: 1px 0;
  width: 80%;

  &__received {
    display: flex;
    float: left;
    &__content {
      max-width: 88%;

      padding: 10px;
      border-radius: 0 10px 10px 10px;
      max-width: 400px !important;
      white-space: pre-line;
    }
  }
  &__sent {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    float: right;
    &__state {
      width: 3%;
    }
    &__content {
      max-width: 88%;
      padding: 10px;
      border-radius: 10px 0 10px 10px;
      color: #d8d8d8;
      white-space: pre-line;
    }
    &__menu {
      width: 6%;
    }
  }
}
</style>
