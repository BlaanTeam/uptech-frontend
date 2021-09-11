<template>
  <div class="py-2">
    <v-row class="ms-10" no-gutters>
      <v-col cols="1">
        <v-skeleton-loader type="avatar"> </v-skeleton-loader>
      </v-col>
      <v-col cols="9" class="rounded-lg mx-1">
        <v-skeleton-loader
          class="rounded-lg"
          type="card"
          width="100%"
          height="50"
        >
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>
