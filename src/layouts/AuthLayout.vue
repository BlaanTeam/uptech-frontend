<template>
  <v-app dark class="auth-layout">
    <SideNav />
    <slot></slot>
  </v-app>
</template>

<script>
import SideNav from "./partials/Auth/SideNav";
export default {
  components: {
    SideNav
  },
  sockets: {
    async "count-unread"(data) {
      await this.$store.dispatch("initMsgsCount", data);
      await this.$store.dispatch("initNotifsCount", data);
    },
    async message(data) {
      this.soundEffect.currentTime = 0;
      this.soundEffect.play();
      await this.$store.dispatch("receiveMessage", {
        convId: data._id,
        user: data.user,
        lastMessage: data.lastMessage
      });
      this.$store.state.MessagesModule.msgsCount = "socket";
    },
    async notif(data) {
      await this.$store.dispatch("addNotif", data);
      await this.$store.dispatch("incrNotifsCount");
    }
  },
  mounted() {
    this.$socket.emit("count-unread");
    this.$socket.io.opts.extraHeaders[
      "x-auth-token"
    ] = this.$store.getters.getToken;
    this.$socket.open();
  }
};
</script>
