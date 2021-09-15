<template>
  <v-app dark>
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
      this.soundEffect.play();
      await this.$store.dispatch("receiveMessage", {
        convId: data._id,
        user: data.user,
        lastMessage: data.lastMessage
      });
      await this.$store.dispatch("incrMsgsCount");
    }
  },
  mounted() {
    this.$socket.emit("count-unread");
  }
};
</script>
