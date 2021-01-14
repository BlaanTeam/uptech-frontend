<template>
  <div class="my-profile bg">
    <!-- <ProfileSkeleton /> -->
    <Profile>
      <Dialog>
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
