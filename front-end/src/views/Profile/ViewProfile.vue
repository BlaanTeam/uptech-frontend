<template>
  <div class="view-profile bg">
    <!-- <ProfileSkeleton /> -->
    <Profile :profile="profile">
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
            text
            class="ms-5 mt-n2 pa-0 ma-0"
          >
            <v-icon size="40">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <div class="bg d-flex flex-column align-start">
          <v-btn
            tile
            block
            text
            :loading="loading"
            @click="log('follow')"
            class="text-capitalize justify-start "
          >
            <v-icon small left>mdi-account-plus-outline</v-icon>
            Follow
          </v-btn>

          <v-btn
            tile
            block
            text
            @click="log('message')"
            class="text-capitalize justify-start"
          >
            <v-icon small left>mdi-message-outline</v-icon>
            Message
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
  data: () => ({
    profile: {
      firstName: "Abdelouahed",
      lastName: "Oumoussa",
      userName: "oumoussa98",
      bio: ` Digital is the world's largest virtual biotech partnering and
             education event, convening thousands of global biotech leaders and
             innovators.`,
      location: "Morocco",
      website: "https://oumoussa98.netlify.com",
      posts: "20",
      followers: "200",
      following: "150",
      joinedAt: "Joined january 14 2020"
    },
    loading: false,
    toggle_none: 0
  }),
  methods: {
    log(e) {
      this.loading = !this.loading;
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
