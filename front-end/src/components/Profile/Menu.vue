<template>
  <div class="menu">
    <FollowUnfollow
      v-if="
        !userInfo.blockedByViewer &&
          !userInfo.hasRejectedViewer &&
          !userInfo.rejectedByViewer
      "
      :userInfo="userInfo"
    />
    <v-btn
      v-if="
        !userInfo.blockedByViewer &&
          !userInfo.hasRejectedViewer &&
          !userInfo.rejectedByViewer
      "
      color="primary"
      class="mt-n2 me-3"
      icon
    >
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
        <Block v-if="!userInfo.blockedByViewer" :userInfo="userInfo" />
        <Unblock v-else :userInfo="userInfo" />
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
import Block from "./Block";
import Unblock from "./Unblock";

export default {
  components: { FollowUnfollow, Block, Unblock },
  props: {
    userInfo: { type: Object, required: false }
  },
  data: () => ({
    followLoading: false,
    toggle_none: 0
  })
};
</script>

<style></style>
