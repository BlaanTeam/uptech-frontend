<template>
  <div class="menu">
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
    <v-btn
      v-else-if="userInfo.followedByViewer"
      :loading="followLoading"
      @click="unFollowUser"
      class="text-capitalize me-3 mt-n2"
      elevation="0"
      dark
      rounded
      height="30"
    >
      <v-icon small left>mdi-account-minus-outline</v-icon>
      Unfollow
    </v-btn>
    <v-menu
      offset-y
      left
      transition="slide-y-transition"
      :close-on-content-click="false"
      attach=".profile"
      :nudge-right="4"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-show="userInfo.requestedByViewer"
          class="text-capitalize me-3 mt-n2"
          elevation="0"
          dark
          rounded
          height="30"
          v-bind="attrs"
          v-on="on"
        >
          requested
        </v-btn>
      </template>
      <div class="bg">
        <v-btn
          tile
          text
          block
          color="red"
          v-if="userInfo.requestedByViewer"
          :loading="followLoading"
          @click="unFollowUser"
          class="text-capitalize"
        >
          <v-icon small left>mdi-account-minus-outline</v-icon>
          Unfollow
        </v-btn>
      </div>
    </v-menu>
    <v-btn color="primary" class="mt-n2 me-3" icon @click="log('message')">
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
        <v-btn
          tile
          block
          text
          @click="log('report')"
          class="text-capitalize justify-start"
        >
          <v-icon small left>mdi-flag-outline</v-icon>
          Report
        </v-btn>
      </div>
    </v-menu>
  </div>
</template>

<script>
export default {
  props: {
    userInfo: { type: Object, required: false }
  },
  data: () => ({
    followLoading: false,
    blockLoading: false,
    toggle_none: 0
  }),
  methods: {
    async followUser() {
      this.followLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/following/${userName}`);
        if (res.status === 204) {
          this.userInfo.followers++;
          if (!this.userInfo.isPrivate) this.userInfo.followedByViewer = true;
          else this.userInfo.requestedByViewer = true;
        }
        this.followLoading = false;

        console.log(res);
      } catch (err) {
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
          this.userInfo.followers--;
          if (!this.userInfo.isPrivate) this.userInfo.followedByViewer = false;
          else this.userInfo.requestedByViewer = false;
        }

        this.followLoading = false;
        console.log(res);
      } catch (err) {
        this.followLoading = false;
        console.log(err);
      }
    },
    async blockUser() {
      this.blockLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/blocks/${userName}`);
        if (res.status === 204) {
          this.userInfo.blockedByViewer = true;
        }
        console.log(res);
        this.blockLoading = false;
      } catch (err) {
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
        }
        console.log(res);
        this.blockLoading = false;
      } catch (err) {
        this.blockLoading = false;
        console.log(err);
      }
    },

    log(e) {
      this.loading = !this.loading;
      console.log(e + " clicked");
    }
  },
  mounted() {
    console.log("Menu Mounted");
  }
};
</script>

<style></style>
