<template>
  <div
    @mouseenter="Menu = true"
    @mouseleave="Menu = false"
    v-if="message.isOwner"
    class="message message__sent d-flex"
    :data-read="!message.read"
  >
    <div class="message__sent__state ms-1">
      <v-icon v-if="messageSent" small>mdi-check</v-icon>
      <v-icon color="teal" v-if="message.read" small>mdi-check-all</v-icon>
    </div>
    <div
      @mouseenter="showDate = true"
      @mouseleave="showDate = false"
      class="message__sent__content primary darken-2"
    >
      {{ message.content }}
    </div>
    <div class="message__sent__menu d-flex align-center me-1">
      <span v-show="showDate" class="me-4 message__date secondarybg">
        {{ new Date(message.createdAt).toLocaleString() }}
      </span>
      <span v-show="Menu">
        <MessageMenu :message="message" @unsend="$emit('unsend')" />
      </span>
    </div>
  </div>

  <div
    v-else
    @mouseenter="Menu = true"
    @mouseleave="Menu = false"
    class="message message__received"
  >
    <div
      @mouseenter="showDate = true"
      @mouseleave="showDate = false"
      class="message__received__content secondarybg darken-1"
    >
      <span></span>
      {{ message.content }}
    </div>
    <div class="message__sent__menu d-flex align-center me-1">
      <span v-show="showDate" class="ms-4 message__date bg secondarybg">
        {{ new Date(message.createdAt).toLocaleString() }}
      </span>
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
    showDate: false
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
.message[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
.message {
  clear: both;
  margin: 1px 0;
  width: 99%;
  &__date {
    padding: 4px 6px;
    box-shadow: 1px 4px 4px rgba(#000000, 0.2);
    opacity: 0.8;
    z-index: 11;
    border-radius: 6px;
  }

  &__received {
    display: flex;
    float: left;
    &__content {
      max-width: 60%;
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
      max-width: 60%;
      padding: 10px;
      border-radius: 10px 0 10px 10px;
      color: #d8d8d8;
      white-space: pre-line;
    }
  }
}
</style>
