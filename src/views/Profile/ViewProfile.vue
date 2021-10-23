<template>
  <div class="view-profile bg">
    <ProfileSkeleton v-if="!loaded" />
    <Profile v-else-if="exist" :userInfo="userInfo">
      <Menu v-if="!userInfo.isOwner" :userInfo="userInfo" />
      <Edit v-else :profile="userInfo.profile">
        <v-btn class="ms-2 mt-n2 text-capitalize" color="primary" dark text>
          <v-icon left size="18">mdi-square-edit-outline</v-icon>
          {{ $t("edit") }}
        </v-btn>
      </Edit>
    </Profile>
    <Tabs v-if="exist" :userInfo="userInfo" />
  </div>
</template>

<script>
import ProfileSkeleton from "@/components/Skeletons/ProfileSkeleton";

export default {
  name: "ViewProfile",
  components: {
    Menu: () => import("@/components/Profile/Menu"),
    Edit: () => import("@/components/Profile/Edit"),
    Profile: () => import("@/components/Profile/Profile"),
    Tabs: () => import("@/components/Profile/Tabs"),
    ProfileSkeleton
  },

  data: () => ({
    userInfo: {},
    exist: false,
    loaded: false
  }),
  async mounted() {
    let userName = this.$route.params.userName;
    if (!userName) userName = await this.$store.getters.getUserName;

    try {
      let res = await this.$http.get(`/users/${userName}`);
      if (res.status === 200) this.exist = true;
      this.userInfo = res.data;
      this.loaded = true;
    } catch (err) {
      this.loaded = true;
      console.log(err);
    }
  }
};
</script>
