<template>
  <v-expand-transition>
    <v-row v-show="display" class="me-2 ms-12 ma-0 pa-0">
      <v-col cols="1" class=" pa-0 ma-0">
        <v-avatar width="20" color="green" class="mt-3">
          <span class="white--text headline">me</span>
        </v-avatar>
      </v-col>
      <v-col cols="8" class="pa-0 ma-0 ms-2">
        <div>
          <v-textarea
            autofocus
            placeholder="What you do think"
            label=""
            rows="1"
            row-height="10"
            v-model="comment"
            auto-grow
          ></v-textarea>
        </div>
      </v-col>
      <v-col cols="2" class="ma-0 pa-0 align-self-center ms-4">
        <v-btn
          class="pa-0 px-2"
          @click="addComment()"
          elevation="0"
          color="primary"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script>
export default {
  props: {
    post: Object,
    index: Number,
    display: Boolean
  },
  data: () => ({
    comment: ""
  }),
  methods: {
    async addComment() {
      if (!this.comment.trim()) return (this.comment = "");
      try {
        const res = await this.$store.dispatch("addComment", {
          comment: this.comment,
          index: this.index,
          id: this.post._id
        });
        this.comment = "";
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style></style>
