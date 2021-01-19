<template>
  <span class="follow-unfollow">
    <v-btn
      v-if="!userInfo.followedByViewer && !userInfo.requestedByViewer"
      :loading="followLoading"
      @click="followUser"
      class="text-capitalize me-3 mt-n2"
      elevation="0"
      dark
      color="primary"
      rounded
      height="30"
    >
      <v-icon small left>mdi-account-plus-outline</v-icon>
      Follow
    </v-btn>

    <v-dialog v-model="dialog" max-width="250px">
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <v-btn
            v-if="userInfo.followedByViewer"
            class="text-capitalize secondarybg me-3 mt-n2"
            elevation="0"
            rounded
            height="30"
          >
            Following
          </v-btn>
          <v-btn
            v-if="userInfo.requestedByViewer"
            class="text-capitalize secondarybg me-3 mt-n2"
            elevation="0"
            rounded
            height="30"
            v-bind="attrs"
            v-on="on"
          >
            requested
          </v-btn>
        </span>
      </template>
      <div class="bg">
        <v-row class="justify-center pt-2" no-gutters>
          <img src="@/assets/images/avatar.svg" width="80" alt="" />
        </v-row>
        <v-row class="text-center py-1 px-6" no-gutters>
          <p>
            your are going to unfollow <strong>@{{ userInfo.userName }}</strong>
          </p>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters class="justify-center">
          <v-btn
            plain
            text
            tile
            class="text-capitalize"
            :loading="followLoading"
            @click="unFollowUser()"
            color="red"
          >
            <v-icon small left>mdi-account-minus-outline</v-icon>
            Unfollow
          </v-btn>
        </v-row>
        <v-divider></v-divider>
        <v-row no-gutters class="justify-center">
          <v-btn
            plain
            text
            tile
            class="text-capitalize justify-center"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-row>
      </div>
    </v-dialog>
  </span>
</template>

<script>
export default {
  props: {
    userInfo: { type: Object, required: true },
    myInfo: { required: false }
  },
  data: () => ({
    followLoading: false,
    dialog: false
  }),
  methods: {
    async followUser() {
      this.followLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/following/${userName}`);
        if (res.status === 204) {
          if (!this.userInfo.isPrivate) {
            this.userInfo.followedByViewer = true;
            this.userInfo.followers++;
            if (this.myInfo) this.myInfo.following++;
            console.log("FollowUnfollow.vue: User Followed :)");
          } else {
            this.userInfo.requestedByViewer = true;
            console.log("FollowUnfollow.vue: Follow request sent :)");
          }
        } else
          console.log(
            "FollowUnfollow.vue(followUser): No error but nothing changed :("
          );
        this.followLoading = false;
      } catch (err) {
        console.log(
          "Something went wrong from:FollowUnfollow.vue (followUser)"
        );
        this.followLoading = false;
        console.log(err);
      }
    },
    async unFollowUser() {
      this.followLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.delete(`/users/following/${userName}`);
        if (res.status === 204) {
          if (!this.userInfo.isPrivate || this.userInfo.followedByViewer) {
            this.userInfo.followedByViewer = false;
            this.userInfo.followers--;
            if (this.myInfo) this.myInfo.following--;
            console.log("FollowUnfollow.vue: User unfollowed :)");
          } else {
            this.userInfo.requestedByViewer = false;
            console.log("FollowUnfollow.vue: Follow request canceled :)");
          }
        } else
          console.log(
            "FollowUnfollow.vue(unFollowUser): No error but nothing changed :("
          );
        this.followLoading = false;
        this.dialog = false;
      } catch (err) {
        console.log(
          "Something went wrong from:FollowUnfollow.vue (unFollowUser)"
        );
        this.followLoading = false;
        console.log(err);
      }
    }
  }
};
</script>

<style></style>
