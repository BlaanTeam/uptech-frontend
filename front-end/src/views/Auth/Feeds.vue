<template>
  <div class="feeds">
    <CreatePost />
    <Posts :posts="posts" />
  </div>
</template>

<script>
import CreatePost from "@/components/AuthComponents/CreatePost";
import Posts from "@/components/AuthComponents/Posts";

export default {
  components: { CreatePost, Posts },
  data: () => ({}),
  methods: {},
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
  max-width: 700px;
  height: 92vh;
  padding: 16px 10px 40px 10px;
  overflow-y: auto;
}
</style>
