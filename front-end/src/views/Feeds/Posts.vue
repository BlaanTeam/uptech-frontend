<template>
  <div class="feeds">
    <CreatePost @creating="handleLoading" />
    <div class="posts">
      <PostSkeleton v-if="loading.value" />
      <div>
        <Post
          v-for="(post, index) in posts"
          :key="post._id"
          :post="post"
          :index="index"
          transition="scale-transition"
        />
        <infinite-loading @infinite="infiniteHandler">
          <template slot="spinner">
            <PostSkeleton />
          </template>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import CreatePost from "@/components/Post/CreatePost";
import Post from "@/components/Post/Post";
import PostSkeleton from "@/components/Skeletons/PostSkeleton";

export default {
  components: { CreatePost, Post, PostSkeleton },
  data: () => ({
    loading: { value: false },
    page: 1
  }),
  computed: {
    posts() {
      return this.$store.getters.getPosts;
    }
  },
  methods: {
    async infiniteHandler($state) {
      try {
        let res = await this.$store.dispatch("getFeedPosts", {
          page: this.page
        });
        if (res.status === 200) {
          if (res.data.posts.length) {
            this.page += 1;
            $state.loaded();
          } else {
            $state.complete();
          }
        }
      } catch (err) {
        $state.error();
        console.log(err);
      }
    },
    handleLoading(loading) {
      this.loading = loading;
    }
  },
  async destroyed() {
    await this.$store.dispatch("destroyPosts");
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
