<template>
  <v-container fluid class="home">
    <v-layout class="d-fex flex-column">
      <h1 class="align-self-center">
        Welcome to our webiste feel free to join us
      </h1>
      <div class="text-center">
        <v-btn class="ma-2" color="success">
          Sign In
        </v-btn>

        <v-btn class="ma-2" color="info">
          Sign Up
        </v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.home {
  padding: unset;
}
</style>
