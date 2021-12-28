<template>
  <v-row
    :class="'align-center mx-auto px-1 py-0 add-comment add-comment' + post._id"
    no-gutters
  >
    <v-col cols="1" class="d-flex align-center me-4">
      <img src="@/assets/images/avatar.svg" width="36" />
    </v-col>
    <v-col class="d-flex align-center">
      <v-row no-gutters>
        <v-col class="d-flex">
          <v-textarea
            id="addCommentTextArea"
            autofocus
            :placeholder="$t('viewComment.placeholder')"
            label=""
            rows="1"
            row-height="10"
            v-model="comment.value"
            auto-grow
          />
        </v-col>
        <v-col cols="1" class="d-flex align-center justify-center">
          <Emojis
            left
            :attach="'.add-comment' + post._id"
            :inputModel="comment"
            element="addCommentTextArea"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="1" class="mx-1">
      <v-btn
        icon
        :loading="loading"
        :disabled="loading"
        @click="addComment()"
        elevation="0"
        color="primary"
      >
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import Emojis from "@/components/Emojis";
export default {
  components: { Emojis },
  props: { post: Object, comments: Array },
  data: () => ({
    comment: { value: "" },
    loading: false
  }),
  methods: {
    async addComment() {
      if (!this.comment.value.trim()) return (this.comment.value = "");
      this.loading = true;
      const api = `/feed/posts/${this.post._id}/comments`;
      const data = { content: this.comment.value };
      try {
        const res = await this.$http.post(api, data);

        if (res.status === 200) {
          console.log("Comment added successfully");
          this.post.comments++;
          this.comments.unshift(res.data.comment);
          this.comment.value = "";
          this.loading = false;
        }
      } catch (err) {
        this.loading = false;
        console.log("Something went wrong from:AddComment");
        console.log(err);
      }
    }
  }
};
</script>

<style>
.add-comment {
  max-width: 500px;
}
</style>
