<template>
  <v-card type="card" class="pb-1 pt-3 px-4 mt-6 mb-8 auth-secondarybg">
    <v-row no-gutters>
      <v-col cols="1">
        <v-skeleton-loader type="avatar"> </v-skeleton-loader>
      </v-col>
      <v-col lg="3" md="3" sm="5" class="pa-0 ma-0 ms-1 mt-n1">
        <v-skeleton-loader class="my-2" type="heading" width="300">
        </v-skeleton-loader>
        <v-skeleton-loader type="text" width="100" height="20">
        </v-skeleton-loader>
      </v-col>
      <v-col lg="1" md="1" sm="2" class="ms-auto mt-1">
        <v-skeleton-loader type="text" width="40" height="20">
        </v-skeleton-loader>
      </v-col>
    </v-row>

    <div class="ps-0 pe-2 py-4">
      <v-skeleton-loader class="" type="card" width="100%" height="100">
      </v-skeleton-loader>
    </div>

    <v-divider></v-divider>
    <v-card-actions class="px-4 py-0 pb-6">
      <v-row class="text-center py-0">
        <v-col class="pa-2">
          <v-skeleton-loader type="card" width="100%" height="34">
          </v-skeleton-loader>
        </v-col>
        <v-col class="pa-2">
          <div>
            <v-skeleton-loader type="card" width="100%" height="34">
            </v-skeleton-loader>
          </div>
        </v-col>
        <v-col class="pa-2">
          <v-skeleton-loader type="card" width="100%" height="34">
          </v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-actions>
    <slot />
  </v-card>
</template>
