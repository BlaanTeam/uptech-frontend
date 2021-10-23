<template>
  <v-menu offset-y nudge-left="20" transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" text icon>
        <v-icon size="30">mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
    <div class="bg d-flex flex-column align-start">
      <v-btn
        @click="unsentMessage"
        :loading="loading"
        :disabled="loading"
        color="red"
        tile
        text
        class="subtitle-2 text-none"
      >
        <v-icon size="13" class="me-1">mdi-delete</v-icon>
        {{ $t("unsent") }}
      </v-btn>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: "MessageMenu",
  props: {
    message: { type: Object, required: true }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    async unsentMessage() {
      try {
        this.loading = true;
        const res = await this.$http.delete(
          "/chats/messages/" + this.message._id
        );
        this.$emit("unsend");
      } catch (err) {
        console.log("MessageMenu(unsentMessage): delete failed");
        console.log(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
