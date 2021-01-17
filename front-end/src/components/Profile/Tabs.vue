<template>
  <div class="tabs mt-4 px-10">
    {{ user }}
    <v-tabs v-model="tabs" centered grow background-color="bg">
      <v-tab>
        Posts
      </v-tab>
      <v-tab>
        Likes and comments
      </v-tab>
      <v-tab>
        Media
      </v-tab>
    </v-tabs>

    <v-tabs-items
      class="auth-bg"
      v-model="tabs"
      v-if="
        userInfo.isPrivate && !userInfo.followedByViewer && !userInfo.isOwner
      "
    >
      <div class="mt-4 text-center auth-bg">
        <h1>Private account</h1>
      </div>
    </v-tabs-items>

    <v-tabs-items v-else v-model="tabs" class="auth-bg px-1">
      <v-tab-item>
        <div v-if="posts.length" class="auth-bg pt-4 px-1">
          <span v-for="(post, index) in posts" :key="post._id">
            <Post
              :post="post"
              :index="index"
              class="my-6"
              transition="scale-transition"
            />
          </span>
        </div>
        <div v-else>
          <h1>No Posts yet</h1>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="auth-bg">
          likes and comments
        </div>
      </v-tab-item>
      <v-tab-item>
        <div class="auth-bg">
          media
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  components: { Post: () => import("@/components/Post/Post") },
  props: {
    userInfo: { type: Object, required: true }
  },
  data: () => ({
    tabs: null,
    posts: [],
    pageInfo: {}
  }),
  methods: {
    async getUserPosts() {
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.get(`/users/${userName}/posts`);
        if (res.status === 200) {
          this.posts = res.data.posts;
          this.pageInfo = res.data.pageInfo;

          console.log(res);
          return res.data.posts;
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    if (
      this.userInfo.isPrivate &&
      !this.userInfo.followedByViewer &&
      !this.userInfo.isOwner
    )
      return;
    else {
      this.getUserPosts();
    }
    this.user.userName = "replaced";
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
