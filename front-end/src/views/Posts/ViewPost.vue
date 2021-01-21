<template>
  <div class="view-post">
    <template>
      <PostSkeleton v-if="!loaded">
        <CommentSkeleton v-for="n in 3" :key="n" />
      </PostSkeleton>
      <Post v-else :post="post" :comments="comments">
        <template #commentsLoading>
          <infinite-loading @infinite="infiniteHandler"> </infinite-loading>
        </template>
      </Post>
    </template>
  </div>
</template>

<script>
import Post from "@/components/Post/Post";
import PostSkeleton from "@/components/Skeletons/PostSkeleton";
import CommentSkeleton from "@/components/Skeletons/CommentSkeleton";

export default {
  name: "ViewPost",
  components: { Post, PostSkeleton, CommentSkeleton },
  data: () => ({
    post: {},
    comments: [],
    page: 2,
    loaded: false
  }),
  methods: {
    async infiniteHandler($state) {
      if (this.comments.length < 10) {
        console.log("hi");
        console.log(this.comments);
        $state.loaded();
        $state.complete();
        return;
      }

      const postId = this.$route.params.postId;
      const api = `/feed/posts/${postId}/comments?page=${this.page}`;
      try {
        let res = await this.$http.get(api);
        if (res.status === 200) {
          if (res.data.comments.length) {
            this.page += 1;
            this.comments.push(...res.data.comments);
            $state.loaded();
            if (res.data.comments.length < 10) $state.complete();
          } else {
            $state.complete();
          }
        }
      } catch (err) {
        $state.error();
        console.log(err);
      }
    }
  },
  async mounted() {
    const postId = this.$route.params.postId;
    try {
      const postRes = await this.$http.get(`/feed/posts/${postId}`);

      const api = `/feed/posts/${postId}/comments`;
      const commentsRes = await this.$http.get(api);

      this.post = postRes.data;
      this.comments = commentsRes.data.comments;
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
  .view-post-btn {
    display: none;
  }
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
