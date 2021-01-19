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
      class="bg"
      v-model="tabs"
      v-else-if="userInfo.blockedByViewer"
    >
      <div class="mt-4 text-center bg">
        <h2>You have been blocked this user</h2>
        <h4>Unblock to see other info</h4>
        <v-btn
          elevation="0"
          :loading="blockLoading"
          @click="unBlockUser"
          class="text-capitalize mt-4"
          color="red"
          dark
        >
          <v-icon small left>mdi-lock-open-variant-outline</v-icon>
          unblock
        </v-btn>
      </div>
    </v-tabs-items>

    <v-tabs-items
      v-else
      v-model="tabs"
      class="px-1"
      :class="{ bg: !posts.length, 'auth-bg': posts.length }"
    >
      <v-tab-item>
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
        <infinite-loading @infinite="infiniteHandler">
          <template slot="no-results">
            <div class="text-center py-4 bg">
              <v-icon size="80" color="#b68d06">
                mdi-database-alert-outline
              </v-icon>
              <h2>This user doesn't have any posts yet</h2>
            </div>
          </template>
          <!-- Todo: add custom messages -->
        </infinite-loading>
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
    PrivateSvg: () => import("@/components/svg/PrivateSvg")
  },
  props: {
    userInfo: { type: Object, required: true }
  },
  data: () => ({
    tabs: null,
    posts: [],
    page: 1,
    pageInfo: {},
    loaded: false,
    blockLoading: false
  }),

  methods: {
    log() {
      console.log("from tabs components");
    },
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
    async unBlockUser() {
      this.blockLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.delete(`/users/blocks/${userName}`);
        if (res.status === 204) {
          this.userInfo.blockedByViewer = false;
          this.userInfo.followedByViewer = false;
          this.userInfo.requestedByViewer = false;
          this.blocked = false;
          console.log("Menu.vue: User UnBlocked :)");
        } else
          console.log("Menu.vue(unBlockUser): No error but nothing changed :(");
        this.blockLoading = false;
      } catch (err) {
        console.log("Something went wrong from:Menu.vue (unBlockUser)");
        this.blockLoading = false;
        console.log(err);
      }
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
