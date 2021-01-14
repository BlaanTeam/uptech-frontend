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
        <h1 class="display-1 mt-n2 d-inline-block">Abdelouahed Oumoussa</h1>
        <span class="d-inline-block mt-n4">
          <slot> </slot>
        </span>
        <h3 class="mt-n2">@oumoussa98</h3>
        <p class="mt-4 pe-10">
          Digital is the world's largest virtual biotech partnering and
          education event, convening thousands of global biotech leaders and
          innovators.
        </p>
        <div class="more-info d-flex flex-column">
          <div class="my-1">
            <v-icon left size="20">mdi-map-marker</v-icon>
            <span>Morocco</span>
          </div>
          <div>
            <v-icon left size="20">mdi-calendar-month</v-icon>
            <span>Joined january 14 2020</span>
          </div>
        </div>
        <div class="statistics">
          <v-row>
            <v-col cols="2">
              <span class="font-weight-bold">10</span> Posts
            </v-col>
            <v-col cols="3">
              <span class="font-weight-bold">200</span> Followers
            </v-col>
            <v-col cols="3">
              <span class="font-weight-bold">150</span> Following
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "Profile"
};
</script>

<style></style>
