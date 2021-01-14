<template>
  <div class="tabs mt-4 px-10">
    <v-tabs v-model="tabs" centered grow background-color="bg">
      <v-tab href="#posts">
        Posts
      </v-tab>

      <v-tab href="#likes-and-comments">
        Likes and comments
      </v-tab>

      <v-tab href="#media">
        Media
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tabs" class="auth-bg px-1">
      <v-tab-item value="posts">
        <div class="auth-bg pt-4 px-1">
          <span v-for="(post, index) in posts" :key="post._id">
            <Post
              :post="post"
              :index="index"
              class="my-6"
              transition="scale-transition"
            />
          </span>
        </div>
      </v-tab-item>
      <v-tab-item value="likes-and-comments">
        <div class="auth-bg">
          likes and comments
        </div>
      </v-tab-item>
      <v-tab-item value="media">
        <div class="auth-bg">
          media
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import Post from "@/components/Post/Post";

export default {
  name: "Tabs",
  components: { Post },
  data: () => ({
    tabs: null
  }),
  computed: {
    posts() {
      return this.$store.getters.getPosts;
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
.theme--dark {
  .tabs {
    .v-tabs {
      border-bottom: 1px solid #3b3b3b !important;
    }
  }
}
.theme--light {
  .tabs {
    .v-tabs {
      border-bottom: 1px solid #a0a0a0 !important;
    }
  }
}
</style>
