<template>
  <div class="profile-skeleton">
    <v-row class="my-10" width="200px">
      <v-col cols="3" class="px-4 lighten-1 text-center ms-4 align-self-center">
        <img
          src="@/assets/images/avatar.svg"
          width="150"
          height="150"
          :color="$vuetify.theme.isDark ? '#3D3E41' : '#C4C2C2'"
        />
      </v-col>
      <v-col cols="8">
        <v-skeleton-loader type="text" width="400"> </v-skeleton-loader>

        <v-skeleton-loader type="text" width="170"> </v-skeleton-loader>

        <v-skeleton-loader
          class="my-4 rounded-lg"
          type="card"
          width="480"
          height="80"
        >
        </v-skeleton-loader>
        <div class="more-info d-flex flex-column">
          <div class="my-1">
            <v-skeleton-loader type="text" width="120"> </v-skeleton-loader>
          </div>
          <div>
            <v-skeleton-loader type="text" width="200"> </v-skeleton-loader>
          </div>
        </div>
        <div class="statistics">
          <v-row>
            <v-col cols="2">
              <v-skeleton-loader type="text" width="80"> </v-skeleton-loader>
            </v-col>
            <v-col cols="3">
              <v-skeleton-loader type="text" width="120"> </v-skeleton-loader>
            </v-col>
            <v-col cols="3">
              <v-skeleton-loader type="text" width="120"> </v-skeleton-loader>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ProfileSkeleton"
};
</script>

<style></style>
