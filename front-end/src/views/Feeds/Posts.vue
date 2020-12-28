<template>
  <div class="feeds">
    <CreatePost />
    <div class="posts">
      <Post
        v-for="(post, index) in posts"
        :key="index"
        :post="post"
        :index="index"
      />
    </div>
  </div>
</template>

<script>
import CreatePost from "@/components/PostComponents/CreatePost";
import Post from "@/components/PostComponents/Post";

export default {
  components: { CreatePost, Post },
  computed: {
    posts() {
      return this.$store.getters.getPosts;
    }
  },
  async created() {
    try {
      await this.$store.dispatch("getFeedPosts");
    } catch (err) {
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
  transition: all 0.4s;
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
