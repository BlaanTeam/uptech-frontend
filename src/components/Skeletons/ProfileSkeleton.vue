<template>
  <div class="profile-skeleton">
    <v-row class="pt-8 px-2 align-center justify-center" wrap no-gutters>
      <v-col
        style="min-width: 154px;max-width: 154px"
        class="lighten-1 ms-2 me-2 mb-2 text-center image"
      >
        <v-avatar
          width="150"
          height="150"
          :color="$vuetify.theme.isDark ? '#3D3E41' : '#E0E0E0'"
        />
      </v-col>
      <v-col>
        <v-skeleton-loader type="text" width="330" />

        <v-skeleton-loader type="text" width="160" />

        <v-skeleton-loader
          class="my-4 rounded-lg"
          type="card"
          width="360"
          height="80"
        />
        <div class="more-info d-flex flex-column">
          <div class="my-1">
            <v-skeleton-loader type="text" width="110" />
          </div>
          <div>
            <v-skeleton-loader type="text" width="190" />
          </div>
        </div>
        <div class="statistics mt-2">
          <v-row>
            <v-col cols="3">
              <v-skeleton-loader type="text" width="70" />
            </v-col>
            <v-col cols="5">
              <v-skeleton-loader type="text" width="110" />
            </v-col>
            <v-col cols="4">
              <v-skeleton-loader type="text" width="110" />
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
