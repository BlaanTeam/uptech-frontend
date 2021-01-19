<template>
  <div class="menu">
    <FollowUnfollow v-if="!blocked" :userInfo="userInfo" />
    <v-btn v-if="!blocked" color="primary" class="mt-n2 me-3" icon>
      <v-icon>mdi-email-outline</v-icon>
    </v-btn>
    <v-menu
      attach=".profile"
      offset-y
      left
      transition="slide-y-transition"
      :close-on-content-click="false"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          color="primary"
          class="mt-n2 pa-0 ma-0"
          icon
        >
          <v-icon size="40">mdi-dots-horizontal</v-icon>
        </v-btn>
      </template>
      <div class="bg d-flex flex-column align-start">
        <v-btn
          v-if="!userInfo.blockedByViewer"
          tile
          block
          text
          color="red"
          :loading="blockLoading"
          @click="blockUser"
          class="text-capitalize justify-start "
        >
          <v-icon small left>mdi-cancel</v-icon>
          block
        </v-btn>
        <v-btn
          v-else
          tile
          block
          text
          :loading="blockLoading"
          @click="unBlockUser"
          class="text-capitalize justify-start "
        >
          <v-icon small left>mdi-cancel</v-icon>
          unblock
        </v-btn>
        <v-btn tile block text class="text-capitalize justify-start">
          <v-icon small left>mdi-flag-outline</v-icon>
          Report
        </v-btn>
      </div>
    </v-menu>
  </div>
</template>

<script>
import FollowUnfollow from "./FollowUnfollow";
export default {
  components: { FollowUnfollow },
  props: {
    userInfo: { type: Object, required: false }
  },
  data: () => ({
    followLoading: false,
    blockLoading: false,
    toggle_none: 0,
    blocked: false
  }),
  methods: {
    async blockUser() {
      this.blockLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/blocks/${userName}`);
        if (res.status === 204) {
          this.userInfo.blockedByViewer = true;
          this.blocked = true;
          console.log("Menu.vue: User Blocked :)");
        } else
          console.log("Menu.vue(blockUser): No error but nothing changed :(");

        this.blockLoading = false;
      } catch (err) {
        console.log("Something went wrong from:Menu.vue (blockUser)");
        this.blockLoading = false;
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

<style></style>
