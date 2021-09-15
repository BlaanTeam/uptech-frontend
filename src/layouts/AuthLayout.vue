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
    }
  },
  mounted() {
    this.$socket.emit("count-unread");
  }
};
</script>
