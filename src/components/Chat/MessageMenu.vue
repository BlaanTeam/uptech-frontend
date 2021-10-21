<template>
  <v-menu offset-y nudge-left="40" transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" text icon>
        <v-icon size="30">mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
    <div class="bg d-flex flex-column align-start">
      <v-btn
        @click="unsentMessage"
        color="red"
        tile
        text
        class="subtitle-2 text-none"
      >
        <v-icon size="13" class="me-1">mdi-delete</v-icon>
        unsent
      </v-btn>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: "MessageMenu",
  props: {
    message: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  methods: {
    async unsentMessage() {
      try {
        await this.$store.dispatch("deleteMessage", {
          id: this.message._id,
          index: this.index,
          convId: this.$route.params.id
        });
      } catch (err) {
        console.log("MessageMenu(unsentMessage): delete failed");
        console.log(err);
      }
    }
  }
};
</script>
