<template>
  <div class="profile">
    <v-row class="pt-10">
      <v-col cols="3" class="px-4 lighten-1 text-center ms-4 align-self-center">
        <img
          src="@/assets/images/avatar.svg"
          width="150"
          height="150"
          color="primary"
        />
      </v-col>
      <v-col cols="8" class="align-self-center">
        <h2
          v-if="userInfo.profile.firstName || userInfo.profile.lastName"
          class="font-weight-regular mt-n3 d-inline-block"
        >
          {{ userInfo.profile.firstName }} {{ userInfo.profile.lastName }}
        </h2>
        <span
          class="d-inline-block float-right me-8"
          :class="{
            'mt-n2': !userInfo.profile.firstName && !userInfo.profile.lastName
          }"
        >
          <slot> </slot>
        </span>
        <h3 class="mt-n2">@{{ userInfo.userName }}</h3>
        <p class="mt-4 pe-3" v-if="userInfo.profile.bio">
          {{ userInfo.profile.bio }}
        </p>
        <div class="more-info d-flex flex-column mt-4">
          <div class="mb-1" v-if="userInfo.profile.location">
            <v-icon left size="18" class="mt-n1">mdi-map-marker</v-icon>
            <span>{{ userInfo.profile.location }}</span>
          </div>
          <div class="mb-1" v-if="userInfo.profile.website">
            <v-icon left size="18" class="mt-n1">mdi-link-variant</v-icon>
            <a
              :href="userInfo.profile.website"
              target="_blanck"
              class="primary--text"
              >{{ userInfo.profile.website }}
            </a>
          </div>
          <div>
            <v-icon left size="18" class="mt-n1">mdi-calendar-month</v-icon>
            <span>{{ new Date(userInfo.createdAt).toDateString() }}</span>
          </div>
        </div>
        <div class="statistics mt-4">
          <v-row>
            <v-col cols="2">
              <span class="font-weight-bold">{{ userInfo.posts }}</span> Posts
            </v-col>
            <v-col
              cols="3"
              class="follows"
              :class="{
                'follows-disabled':
                  userInfo.isPrivate && !userInfo.followedByViewer
              }"
            >
              <a text @click="followers.value = true">
                <span class="font-weight-bold">{{ userInfo.followers }}</span>
                Followers
              </a>
              <Followers
                v-if="!userInfo.isPrivate || userInfo.followedByViewer"
                :userName="userInfo.userName"
                :myInfo="myInfo"
                :dialog="followers"
              />
            </v-col>
            <v-col
              cols="3"
              class="follows"
              :class="{
                'follows-disabled':
                  userInfo.isPrivate && !userInfo.followedByViewer
              }"
            >
              <a text @click="following.value = true">
                <span class="font-weight-bold">{{ userInfo.following }}</span>
                Following
              </a>
              <Following
                v-if="!userInfo.isPrivate || userInfo.followedByViewer"
                :userName="userInfo.userName"
                :myInfo="myInfo"
                :dialog="following"
              />
            </v-col>
          </v-row>
        </div>
        <v-row v-if="userInfo.hasRequestedViewer" no-gutters class="mt-4">
          <v-btn
            class="text-capitalize me-4"
            elevation="0"
            dark
            color="primary"
            rounded
            width="120"
          >
            <v-icon small left>mdi-account-check</v-icon>
            Confirm
          </v-btn>

          <v-btn
            width="120"
            class="text-capitalize mx-4 secondarybg"
            elevation="0"
            rounded
          >
            <v-icon small left>mdi-account-cancel</v-icon>
            Reject
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {
    Following: () => import("@/components/Profile/Following"),
    Followers: () => import("@/components/Profile/Followers")
  },
  props: { userInfo: { type: Object, required: true } },
  data: () => ({
    following: { value: false },
    followers: { value: false }
  }),
  computed: {
    myInfo() {
      let userName = this.$store.getters.getUserName;
      if (this.userInfo.userName === userName) return this.userInfo;
      else return false;
    }
  }
};
</script>

<style>
.profile a:hover {
  text-decoration: underline;
}
.profile .follows:hover {
  text-decoration: underline;
}
.profile .follows-disabled {
  pointer-events: none;
}
</style>
