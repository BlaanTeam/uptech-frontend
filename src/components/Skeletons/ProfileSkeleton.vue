<template>
  <div class="profile-skeleton" style="max-width: 600px">
    <v-row class="pb-10 pt-5" width="100px">
      <v-col
        cols="3"
        class="px-4 lighten-1 text-center ms-4 me-2 align-self-center"
      >
        <v-avatar
          width="150"
          height="150"
          :color="$vuetify.theme.isDark ? '#3D3E41' : '#E0E0E0'"
        />
      </v-col>
      <v-col cols="8">
        <v-skeleton-loader type="text" width="350"> </v-skeleton-loader>

        <v-skeleton-loader type="text" width="160"> </v-skeleton-loader>

        <v-skeleton-loader
          class="my-4 rounded-lg"
          type="card"
          width="400"
          height="80"
        >
        </v-skeleton-loader>
        <div class="more-info d-flex flex-column">
          <div class="my-1">
            <v-skeleton-loader type="text" width="110"> </v-skeleton-loader>
          </div>
          <div>
            <v-skeleton-loader type="text" width="190"> </v-skeleton-loader>
          </div>
        </div>
        <div class="statistics mt-2">
          <v-row>
            <v-col cols="2">
              <v-skeleton-loader type="text" width="70"> </v-skeleton-loader>
            </v-col>
            <v-col cols="3" class="ms-4">
              <v-skeleton-loader type="text" width="110"> </v-skeleton-loader>
            </v-col>
            <v-col cols="3" class="ms-4">
              <v-skeleton-loader type="text" width="110"> </v-skeleton-loader>
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
