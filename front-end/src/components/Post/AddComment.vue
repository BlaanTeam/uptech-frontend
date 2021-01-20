<template>
  <v-row :class="'me-2 ms-12 ma-0 pa-0 add-comment' + post._id">
    <v-col cols="1" class=" pa-0 ma-0">
      <v-avatar width="20" color="green" class="mt-3">
        <span class="white--text headline">me</span>
      </v-avatar>
    </v-col>
    <v-col cols="8" class="pa-0 ma-0 ms-2">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            id="addCommentTextArea"
            autofocus
            placeholder="What you do think"
            label=""
            rows="1"
            row-height="10"
            v-model="comment.value"
            auto-grow
          ></v-textarea>
        </v-col>
        <v-col cols="1" class="ms-1 align-self-center">
          <Emojis
            left
            :attach="'.add-comment' + post._id"
            :inputModel="comment"
            element="addCommentTextArea"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="2" class="ma-0 pa-0 align-self-center ms-4">
      <v-btn
        height="34"
        class="pa-0 px-2"
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
  props: { post: Object },
  data: () => ({
    comment: { value: "" },
    loading: false
  }),
  methods: {
    async addComment() {
      this.loading = true;
      if (!this.comment.value.trim()) return (this.comment.value = "");

      const api = `/feed/posts/${this.post._id}/comments`;
      const data = { content: this.comment.value };
      try {
        const res = await this.$http.post(api, data);

        if (res.status === 200) {
          console.log("Comment added successfully");
          this.post.comments++;
          if (!this.post.commentsData) this.post.commentsData = [];
          this.post.commentsData.unshift(res.data.comment);
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

<style></style>
