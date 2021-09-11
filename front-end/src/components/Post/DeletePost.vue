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
            This post is going to deleted
            <v-icon size="18" class="ms-1 mt-n1">mdi-delete-alert</v-icon>
          </h1>
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn
            @click="deletePost(post._id, index)"
            elevation="0"
            color="red"
            width="100"
            class="mr-10 text-capitalize px-4"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon left size="18" class="mt-n1">mdi-delete-empty</v-icon>
            Delete
          </v-btn>

          <v-btn
            elevation="0"
            width="100"
            class="ml-10 text-capitalize px-4"
            @click="dialog = false"
            color="secondarybg"
          >
            Cancel
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
    async deletePost(id, index) {
      this.loading = true;
      try {
        let res = await this.$store.dispatch("deletePost", {
          id: id,
          index: index
        });
        if (res.status === 204) {
          this.loading = false;
          this.dialog = false;
        }
      } catch (err) {
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
