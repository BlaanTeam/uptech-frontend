<template>
  <div>
    <v-menu
      v-model="menu"
      offset-x
      right
      :open-on-hover="hover"
      :close-on-content-click="false"
      :open-delay="1000"
      :attach="'#profile__popover' + index"
    >
      <template v-slot:activator="{ on, attrs }">
        <span :id="'profile__popover' + index" v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <div>
        <v-card
          v-if="loading"
          class="auth-secondarybg d-flex align-center justify-center"
          width="250"
          height="200"
        >
          <h6 v-if="error">Sorry, Something went wrong :(</h6>
          <v-btn v-else text :loading="true"></v-btn>
        </v-card>
        <v-card v-else class="auth-secondarybg">
          <v-card-title>
            <img
              src="@/assets/images/avatar.svg"
              alt="avatar"
              width="40"
              class="justify-self-start"
            />
            <div class="ms-4 justify-self-center">
              <h3 class="title mt-n1">
                {{ user.profile.firstName }} {{ user.profile.lastName }}
              </h3>
              <h5 class="caption mt-n2">@{{ user.userName }}</h5>
            </div>
          </v-card-title>
          <v-divider />
          <v-card-subtitle class="d-flex text-center">
            <div class="ps-1">
              <div class="font-weight-bold">Posts</div>
              {{ user.posts }}
            </div>
            <div class="mx-6">
              <div class="font-weight-bold">Followers</div>
              {{ user.followers }}
            </div>
            <div class="pe-1">
              <div class="font-weight-bold">Following</div>
              {{ user.following }}
            </div>
          </v-card-subtitle>
          <v-divider v-if="!user.isOwner" />
          <v-card-actions v-if="!user.isOwner">
            <FollowUnfollow
              @popDialog="hover = !hover"
              class="ms-1"
              :userInfo="user"
            />
            <v-btn
              color="info darken-1"
              class="mt-n1 ms-auto text-capitalize"
              height="30"
              rounded
              @click="sendMessage"
            >
              <v-icon left small>mdi-email-outline</v-icon>
              message
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    index: { type: [String, Number], required: true },
    userName: { type: String, required: true }
  },
  components: { FollowUnfollow: () => import("../Profile/FollowUnfollow") },

  data: () => ({
    menu: false,
    loading: true,
    error: false,
    funcInvocked: false,
    hover: true
  }),

  watch: {
    async menu(newVal, oldVal) {
      if (newVal === true && !this.funcInvocked) {
        this.funcInvocked = true;
        try {
          let res = await this.$http.get(`/users/${this.userName}`);
          if (res.status === 200) {
            this.user = res.data;
            this.loading = false;
          }
        } catch (err) {
          this.error = true;
          console.log(err);
        }
      }
    }
  },
  methods: {
    async sendMessage() {
      let res = await this.$store.dispatch("initiateNewConversation", {
        _id: this.user._id
      });
      this.$router.push({ name: "ViewMessages", params: { id: res._id } });
    }
  }
};
</script>

<style></style>
