<template>
  <div class="post-delete">
    <v-dialog v-model="dialog" width="400">
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <v-card class="auth-bg py-4 px-1">
        <v-card-title class="pb-6 justify-center">
          <h1 class="subtitle-1">
            {{ $t("deletePostAlert") }}
            <v-icon size="18" class="ms-1 mt-n1">mdi-delete-alert</v-icon>
          </h1>
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn
            @click="deletePost"
            elevation="0"
            color="red"
            width="100"
            class="mr-10 text-capitalize pe-4"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon left size="18" class="mt-n1">mdi-delete-empty</v-icon>
            {{ $t("delete") }}
          </v-btn>

          <v-btn
            elevation="0"
            width="100"
            class="ml-10 text-capitalize px-4"
            @click="dialog = false"
            color="secondarybg"
          >
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    post: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  data: () => ({
    dialog: false,
    loading: false
  }),
  methods: {
    async deletePost() {
      this.loading = true;
      try {
        await this.$store.dispatch("deletePost", {
          id: this.post._id,
          index: this.index
        });
        this.loading = false;
        this.dialog = false;
        if (this.$route.path.startsWith("/post"))
          await this.$router.push({ name: "Feeds" });
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    }
  }
};
</script>

<style>
.v-card[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
</style>
