<template>
  <v-menu
    attach=".profile"
    offset-y
    left
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="primary"
        text
        class="ms-5 mt-n2 pa-0 ma-0"
      >
        <v-icon size="40">mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
    <div class="bg d-flex flex-column align-start">
      <v-btn
        tile
        block
        text
        :loading="loading"
        @click="log('follow')"
        class="text-capitalize justify-start "
      >
        <v-icon small left>mdi-account-plus-outline</v-icon>
        Follow
      </v-btn>

      <v-btn
        tile
        block
        text
        @click="log('message')"
        class="text-capitalize justify-start"
      >
        <v-icon small left>mdi-message-outline</v-icon>
        Message
      </v-btn>
      <v-btn
        tile
        block
        text
        @click="log('report')"
        class="text-capitalize justify-start"
      >
        <v-icon small left>mdi-flag-outline</v-icon>
        Report
      </v-btn>
    </div>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    toggle_none: 0
  }),
  methods: {
    log(e) {
      this.loading = !this.loading;
      console.log(e + " clicked");
    }
  }
};
</script>

<style></style>
