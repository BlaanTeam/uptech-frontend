<template>
  <div class="tabs mt-8 px-4">
    <v-tabs v-model="tabs" centered grow background-color="bg">
      <v-tab>
        {{ $t("posts") }}
      </v-tab>
      <v-tab>
        {{ $t("viewProfile.likesAndComments") }}
      </v-tab>
      <v-tab>
        {{ $t("saved") }}
      </v-tab>
    </v-tabs>

    <v-tabs-items
      class="bg"
      v-model="tabs"
      v-if="
        userInfo.isPrivate &&
          !userInfo.followedByViewer &&
          !userInfo.isOwner &&
          !userInfo.blockedByViewer
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
      class="bg"
      v-model="tabs"
      v-else-if="userInfo.blockedByViewer"
    >
      <div class="mt-4 text-center bg">
        <h2>You have been blocked this user</h2>
        <h4>Unblock to see other info</h4>
        <Unblock :userInfo="userInfo">
          <v-btn
            @click="dialog = true"
            elevation="0"
            class="text-capitalize mt-4"
            color="red"
            dark
          >
            <v-icon small left>mdi-lock-open-variant-outline</v-icon>
            {{ $t("unblock") }}
          </v-btn>
        </Unblock>
      </div>
    </v-tabs-items>

    <v-tabs-items
      v-else
      v-model="tabs"
      :class="{ bg: !posts.length, 'auth-bg': posts.length }"
    >
      <v-tab-item class="px-1">
        <CreatePost
          @creating="handleLoading"
          @created="addPost"
          v-if="userInfo.isOwner"
        />
        <div class="pb-10">
          <PostSkeleton v-if="loading.value" />
          <div v-if="loaded && posts.length">
            <span v-for="(post, index) in posts" :key="post._id">
              <Post
                :post="post"
                :comments="(post.commentsData = [])"
                :index="index"
                class="my-6"
                transition="scale-transition"
              />
            </span>
          </div>
        </div>
        <infinite-loading @infinite="infiniteHandler">
          <template slot="no-results">
            <span></span>
            <div v-if="!posts.length" class="text-center py-4 bg">
              <v-icon size="80" color="#b68d06">
                mdi-database-alert-outline
              </v-icon>
              <h2>This user doesn't have any posts yet</h2>
            </div>
          </template>
        </infinite-loading>
      </v-tab-item>
      <v-tab-item>
        <div style="height: 100vh">
          {{ $t("viewProfile.likesAndComments") }}
        </div>
      </v-tab-item>
      <v-tab-item>
        <div style="height: 100vh">
          {{ $t("saved") }}
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
    CreatePost: () => import("@/components/Post/CreatePost"),
    PostSkeleton: () => import("@/components/Skeletons/PostSkeleton"),
    Unblock: () => import("./Unblock")
  },
  props: {
    userInfo: { type: Object, required: true }
  },
  data: () => ({
    tabs: null,
    posts: [],
    comments: [],
    page: 1,
    pageInfo: {},
    loaded: false,
    blockLoading: false,
    loading: { value: false }
  }),

  methods: {
    async infiniteHandler($state) {
      try {
        let userName = this.userInfo.userName;
        const api = `/users/${userName}/posts?page=${this.page}`;

        let res = await this.$http.get(api);
        if (res.status === 200) {
          if (res.data.posts.length) {
            this.page += 1;
            this.posts.push(...res.data.posts);
            $state.loaded();
            if (res.data.posts.length < 20) $state.complete();
            this.loaded = true;
          } else {
            this.loaded = true;
            $state.complete();
          }
        }
      } catch (err) {
        this.loaded = true;
        $state.error();
        console.log(err);
      }
    },
    handleLoading(loading) {
      this.loading = loading;
      console.log(this.loading);
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
