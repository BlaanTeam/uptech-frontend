<template>
  <div class="profile">
    <v-row class="pt-10" width="200px">
      <v-col cols="3" class="px-4 lighten-1 text-center ms-4 align-self-center">
        <img
          src="@/assets/images/avatar.svg"
          width="150"
          height="150"
          color="primary"
        />
      </v-col>
      <v-col cols="8" class="">
        <h1 class="display-1 mt-n2 d-inline-block">
          {{ profile.firstName }} {{ profile.lastName }}
        </h1>
        <span class="d-inline-block mt-n4">
          <slot> </slot>
        </span>
        <h3 class="mt-n2">@{{ profile.userName }}</h3>
        <p class="mt-4 pe-10" v-if="profile.bio">
          {{ profile.bio }}
        </p>
        <div class="more-info d-flex flex-column">
          <div class="my-1" v-if="profile.location">
            <v-icon left size="18" class="mt-n1">mdi-map-marker</v-icon>
            <span>{{ profile.location }}</span>
          </div>
          <div class="mb-1" v-if="profile.website">
            <v-icon left size="18" class="mt-n1">mdi-link-variant</v-icon>
            <a :href="profile.website" target="_blanck" class="primary--text"
              >{{ profile.website }}
            </a>
          </div>
          <div>
            <v-icon left size="18" class="mt-n1">mdi-calendar-month</v-icon>
            <span>{{ profile.joinedAt }}</span>
          </div>
        </div>
        <div class="statistics">
          <v-row>
            <v-col cols="2">
              <span class="font-weight-bold">{{ profile.posts }}</span> Posts
            </v-col>
            <v-col cols="3">
              <span class="font-weight-bold">{{ profile.followers }}</span>
              Followers
            </v-col>
            <v-col cols="3">
              <span class="font-weight-bold">{{ profile.following }}</span>
              Following
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: { profile: { type: Object, required: true } }
};
</script>

<style>
.profile a:hover {
  text-decoration: underline;
}
</style>
