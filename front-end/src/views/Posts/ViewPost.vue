<template>
  <div class="view-post">
    <template>
      <PostSkeleton v-if="!loaded">
        <CommentSkeleton v-for="n in 3" :key="n" />
      </PostSkeleton>
      <Post v-else :post="post" />
    </template>
  </div>
</template>

<script>
import Post from "@/components/PostComponents/Post";
import PostSkeleton from "@/components/Skeletons/PostSkeleton";
import CommentSkeleton from "@/components/Skeletons/CommentSkeleton";

export default {
  name: "ViewPost",
  components: { Post, PostSkeleton, CommentSkeleton },
  data: () => ({
    post: {},
    loaded: false
  }),
  async mounted() {
    const postId = this.$route.params.postId;
    try {
      const res = await this.$http.get(`/feed/posts/${postId}`);
      this.post = res.data;
      this.loaded = true;
    } catch (error) {
      this.loaded = true;
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
  .theme--light {
    #read-more {
      color: #240497 !important;
    }
  }
  .theme--dark {
    #read-more {
      color: #f5b01b !important;
    }
  }
  .v-car {
    transition: all 5s !important;
  }
}
</style>
