<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
      open-on-hover
      :attach="'#profile__popover' + index"
    >
      <template v-slot:activator="{ on, attrs }">
        <span :id="'profile__popover' + index" v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>

      <v-card class="auth-secondarybg">
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
            100
          </div>
          <div class="mx-6">
            <div class="font-weight-bold">Followers</div>
            22
          </div>
          <div class="pe-1">
            <div class="font-weight-bold">Following</div>
            200
          </div>
        </v-card-subtitle>
        <v-divider />
        <v-card-actions class="justify-center">
          <FollowUnfollow v-if="!isOwner" :userInfo="user" />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    index: { type: [String, Number], required: true },
    user: { type: Object, required: true }
  },
  components: { FollowUnfollow: () => import("../Profile/FollowUnfollow") },

  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true
  }),
  computed: {
    isOwner() {
      return this.$store.getters.getUserName === this.user.userName;
    }
  }
};
</script>

<style></style>
