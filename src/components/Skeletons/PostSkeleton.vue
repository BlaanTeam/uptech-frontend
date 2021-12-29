<template>
  <v-card type="card" class="pb-1 pt-3 px-4 mt-6 mb-8 auth-secondarybg">
    <v-row no-gutters>
      <v-col style="max-width:48px;min-width:48px">
        <v-skeleton-loader type="avatar" />
      </v-col>
      <v-col cols="6" class="pa-0 ma-0 ms-1 mt-n1">
        <v-skeleton-loader class="my-2" type="heading" width="300" />
        <v-skeleton-loader type="text" width="100" height="20" />
      </v-col>
      <v-col lg="1" md="1" sm="2" class="ms-auto mt-1">
        <v-skeleton-loader type="text" width="40" height="20" />
      </v-col>
    </v-row>

    <div class="ps-0 pe-2 py-4">
      <v-skeleton-loader class="" type="card" width="100%" height="100" />
    </div>
    <v-divider></v-divider>
    <v-card-actions class="px-4 my-2 pb-6">
      <v-row class="text-center py-0">
        <v-col class="pa-2">
          <v-skeleton-loader type="card" width="100%" height="34" />
        </v-col>
        <v-col class="pa-2">
          <v-skeleton-loader type="card" width="100%" height="34" />
        </v-col>
        <v-col class="pa-2">
          <v-skeleton-loader type="card" width="100%" height="34" />
        </v-col>
      </v-row>
    </v-card-actions>
    <slot />
  </v-card>
</template>
