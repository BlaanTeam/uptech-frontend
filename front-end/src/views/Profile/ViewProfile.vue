<template>
  <div class="view-profile bg">
    <!-- <ProfileSkeleton /> -->
    <Profile>
      <v-menu
        nudge-right="10"
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
            text
            class="ms-5 mt-n2 pa-0 ma-0"
          >
            <v-icon size="40">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list-item-group dense class="auth-secondarybg text-center">
          <v-list-item dense @click="log('follow')">
            <v-list-item-title>Follow</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="log('message')">
            <v-list-item-title>Message</v-list-item-title>
          </v-list-item>
          <v-list-item dense @click="log('report')">
            <v-list-item-title>Report</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-menu>
    </Profile>
    <Tabs />
  </div>
</template>

<script>
import Profile from "@/components/Profile/Profile";
import ProfileSkeleton from "@/components/Skeletons/ProfileSkeleton";
import Tabs from "@/components/Profile/Tabs";

export default {
  name: "MyProfile",
  components: { Profile, Tabs /*ProfileSkeleton*/ },
  methods: {
    log(e) {
      console.log(e + " clicked");
    }
  }
};
</script>

<style lang="scss">
.view-profile {
  width: 60vw;
}
</style>
