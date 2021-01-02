<template>
  <div class="feeds">
    <CreatePost @creating="handleLoading" />
    <div class="posts">
      <span v-if="!loaded">
        <PostSkeleton v-for="n in 5" :key="n" />
      </span>
      <PostSkeleton v-if="loading.value" />
      <span v-if="loaded">
        <Post
          v-for="(post, index) in posts"
          :key="post._id"
          :post="post"
          :index="index"
          transition="scale-transition"
        />
      </span>
    </div>
  </div>
</template>

<script>
import CreatePost from "@/components/PostComponents/CreatePost";
import Post from "@/components/PostComponents/Post";
import PostSkeleton from "@/components/Skeletons/PostSkeleton";

export default {
  components: { CreatePost, Post, PostSkeleton },
  data: () => ({
    loaded: false,
    loading: { value: false }
  }),
  computed: {
    posts() {
      return this.$store.getters.getPosts;
    }
  },
  methods: {
    handleLoading(loading) {
      this.loading = loading;
    }
  },

  async mounted() {
    try {
      await this.$store.dispatch("getFeedPosts");
      this.loaded = true;
    } catch (err) {
      this.loaded = true;
      console.log(err);
    }
  }
};
</script>

<style lang="scss">
.feeds {
  max-width: 50vw;
  height: 92vh;
  padding: 16px 10px 40px 10px;
  overflow-y: auto;
}
.posts {
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
