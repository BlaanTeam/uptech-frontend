<template>
  <div class="view-post">
    <template v-if="post._id">
      <Post :post="post" />
    </template>
  </div>
</template>

<script>
import Post from "@/components/PostComponents/Post";

export default {
  name: "ViewPost",
  components: {
    Post
  },
  data: () => ({
    post: {}
  }),
  async created() {
    const postId = this.$route.params.postId;
    try {
      const res = await this.$http.get(`/feed/posts/${postId}`);

      this.post = res.data;
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style lang="scss">
.view-post {
  max-width: 50vw;
  height: 92vh;
  padding: 16px 10px 40px 10px;
  overflow-y: auto;
  .container-emoji {
    height: 250px !important;
  }
}
</style>
