<template>
  <div class="tabs mt-8 px-10">
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
      class="bg"
      v-model="tabs"
      v-if="
        userInfo.isPrivate && !userInfo.followedByViewer && !userInfo.isOwner
      "
    >
      <div class="mt-4 text-center bg">
        <h3>Oops, You get Into a private area</h3>
        <h4 class="font-weight-regular">
          You can not see any info about this account
        </h4>
        <h4 class="font-weight-regular">Try to send a follow request</h4>
        <PrivateSvg width="300" />
      </div>
    </v-tabs-items>

    <v-tabs-items
      v-else
      v-model="tabs"
      class="px-1"
      :class="{ bg: !posts.length, 'auth-bg': posts.length }"
    >
      <v-tab-item>
        <div v-if="!loaded">
          <PostSkeletonVue v-for="i in 4" :key="i" />
        </div>
        <div v-if="loaded && posts.length" class="auth-bg pt-4 px-1">
          <span v-for="(post, index) in posts" :key="post._id">
            <Post
              :post="post"
              :index="index"
              class="my-6"
              transition="scale-transition"
            />
          </span>
        </div>
        <div v-if="loaded && !posts.length" class="text-center py-4 bg">
          <v-icon size="80" color="#b68d06">mdi-database-alert-outline</v-icon>
          <h2>This user doesn't have any posts yet</h2>
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
  components: {
    Post: () => import("@/components/Post/Post"),
    PrivateSvg: () => import("@/components/svg/PrivateSvg"),
    PostSkeletonVue: () => import("@/components/Skeletons/PostSkeleton")
  },
  props: {
    userInfo: { type: Object, required: true }
  },
  data: () => ({
    tabs: null,
    posts: [],
    pageInfo: {},
    loaded: false
  }),
  methods: {
    async getUserPosts() {
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.get(`/users/${userName}/posts`);
        if (res.status === 200) {
          this.posts = res.data.posts;
          this.pageInfo = res.data.pageInfo;
          this.loaded = true;

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
      border-bottom: 1px solid #e6b30d !important;
    }
  }
}
</style>
