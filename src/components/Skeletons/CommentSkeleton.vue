<template>
  <div class="py-2">
    <v-row class="ms-4" no-gutters>
      <v-col style="max-width:48px;min-width:48px">
        <v-skeleton-loader type="avatar" />
      </v-col>
      <v-col cols="9" class="rounded-lg mx-1">
        <v-skeleton-loader
          class="rounded-lg"
          type="card"
          width="100%"
          height="50"
        />
      </v-col>
    </v-row>
  </div>
</template>
