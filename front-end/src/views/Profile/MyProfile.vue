<template>
  <div class="my-profile bg">
    <!-- <ProfileSkeleton /> -->
    <Profile :profile="profile">
      <Dialog :profile="profile">
        <v-btn
          class="ms-2 mt-n2 text-capitalize"
          @click="log('Edit')"
          color="primary"
          dark
          text
        >
          <v-icon left size="18">mdi-square-edit-outline</v-icon>
          Edit
        </v-btn>
      </Dialog>
    </Profile>
    <Tabs />
  </div>
</template>

<script>
import Profile from "@/components/Profile/Profile";
import ProfileSkeleton from "@/components/Skeletons/ProfileSkeleton";
import Tabs from "@/components/Profile/Tabs";
import Dialog from "@/components/Profile/Dialog";

export default {
  name: "MyProfile",
  components: { Profile, Tabs, Dialog /*ProfileSkeleton*/ },
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
    }
  }),
  methods: {
    log(e) {
      console.log(e + " clicked");
    }
  }
};
</script>

<style lang="scss">
.my-profile {
  width: 56vw;
}
</style>
