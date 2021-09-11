<template>
  <div class="feeds">
    <CreatePost @creating="handleLoading" @created="addPost" />
    <div class="posts">
      <PostSkeleton v-if="loading.value" />
      <Post
        v-for="(post, index) in posts"
        :key="post._id"
        :post="post"
        :index="index"
        :comments="(post.commentsData = [])"
        transition="scale-transition"
      />
      <infinite-loading @infinite="infiniteHandler">
        <template slot="no-results">
          <span></span>
          <div v-if="!posts.length">
            <v-icon size="80" color="#b68d06">
              mdi-database-alert-outline
            </v-icon>
            <h2 class="mt-4 px-2 font-weight-regular">
              It's quiet here nothing to show for you
            </h2>
            <h3 class="font-weight-light">
              Find accounts that you're interested in
              <br />
              And make sure to follow them to get some noise out here
            </h3>
          </div>
        </template>
      </infinite-loading>
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
    comments: [],
    createdAt: null
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
          createdAt: this.createdAt
        });
        if (res.status === 200) {
          if (res.data.posts.length) {
            let lastPost = res.data.posts[res.data.posts.length - 1];
            this.createdAt = lastPost.createdAt;
            $state.loaded();
            if (res.data.posts.length < 20) {
              $state.complete();
              this.createdAt = null;
            }
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
    },
    addPost({ content, isPrivate, payload }) {
      payload.comments = 0;
      payload.likes = 0;
      payload.like = false;
      this.posts.unshift(payload);
    }
  }
};
</script>

<style lang="scss">
.feeds {
  max-width: 50vw;
  overflow: hidden;
  padding: 16px 10px 40px 10px;
  overflow-x: hidden;
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
