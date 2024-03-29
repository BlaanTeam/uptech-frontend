<template>
  <div class="profile">
    <v-row class="pt-8 align-center justify-center" no-gutters wrap>
      <v-col class="ms-2 lighten-1 text-center profile__image">
        <img
          src="@/assets/images/avatar.svg"
          width="150"
          height="150"
          color="primary"
        />
      </v-col>
      <v-col class="pt-4 ms-2 px-2 mx-auto profile__info">
        <h2
          v-if="userInfo.profile.firstName || userInfo.profile.lastName"
          class="title mt-n3 d-inline-block"
        >
          {{ userInfo.profile.firstName }} {{ userInfo.profile.lastName }}
        </h2>
        <span
          class="d-inline-block float-right"
          :class="{
            'mt-n2': !userInfo.profile.firstName && !userInfo.profile.lastName
          }"
        >
          <slot />
        </span>
        <h3 class="mt-n2 subtitle-1">@{{ userInfo.userName }}</h3>
        <p class="mt-4 pe-3 bio" v-if="userInfo.profile.bio">
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
            <v-col cols="3">
              <span class="font-weight-bold">{{ userInfo.posts }}</span>
              {{ $t("posts") }}
            </v-col>
            <v-col
              cols="4"
              class="follows"
              :class="{
                'follows-disabled':
                  (userInfo.isPrivate &&
                    !userInfo.followedByViewer &&
                    !userInfo.isOwner) ||
                  userInfo.blockedByViewer
              }"
            >
              <a text @click="followers.value = true">
                <span class="font-weight-bold">{{ userInfo.followers }}</span>
                {{ $t("followers") }}
              </a>
              <Followers
                v-if="!userInfo.isOwner || !userInfo.blockedByViewer"
                :userName="userInfo.userName"
                :myInfo="myInfo"
                :dialog="followers"
              />
            </v-col>
            <v-col
              cols="4"
              class="follows"
              :class="{
                'follows-disabled':
                  (userInfo.isPrivate &&
                    !userInfo.followedByViewer &&
                    !userInfo.isOwner) ||
                  userInfo.blockedByViewer
              }"
            >
              <a text @click="following.value = true">
                <span class="font-weight-bold">{{ userInfo.following }}</span>
                {{ $t("following") }}
              </a>
              <Following
                v-if="!userInfo.isOwner || !userInfo.blockedByViewer"
                :userName="userInfo.userName"
                :myInfo="myInfo"
                :dialog="following"
              />
            </v-col>
          </v-row>
        </div>
        <v-row no-gutters class="mt-4">
          <Confirm v-if="userInfo.hasRequestedViewer" :userInfo="userInfo" />
          <RejectUnreject
            v-if="userInfo.hasRequestedViewer || userInfo.rejectedByViewer"
            :userInfo="userInfo"
          />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {
    Following: () => import("./Following"),
    Followers: () => import("./Followers"),
    Confirm: () => import("./Confirm"),
    RejectUnreject: () => import("./RejectUnreject")
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

<style lang="scss">
.profile {
  &__image {
    min-width: 154px !important;
    max-width: 154px !important;
  }
  &__info {
    min-width: 300px !important;
    margin: 0 auto;
  }
  a:hover {
    text-decoration: underline;
  }
  .follows:hover {
    text-decoration: underline;
  }
  .follows-disabled {
    pointer-events: none;
  }
  .bio {
    white-space: pre-line;
  }
}
</style>
