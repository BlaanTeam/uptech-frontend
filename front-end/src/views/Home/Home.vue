<template>
  <v-container fluid class="home pa-0">
    <section class="first-section d-flex align-center pa-4">
      <v-layout class="first-section__background"></v-layout>
      <v-layout class="first-section__header flex-column align-center mt-10">
        <h1 class="first-section__title display-3 pb-2 ">
          Good to see you found us !
        </h1>
        <h2 class="first-section__title display-1 pb-10">
          Hope you'll have a great time
        </h2>
        <v-layout>
          <v-btn
            elevation="0"
            rounded
            dark
            class="ma-4 mr-6 py-6 px-12"
            color="amber darken-3"
          >
            Sign In
          </v-btn>

          <v-btn
            elevation="0"
            rounded
            dark
            class="ma-4 py-6 px-12"
            color="blue lighten-1"
          >
            Sign Up
          </v-btn>
        </v-layout>
        <div class="display-5 ma-4 mt-15 ">
          I'm curious, just want to take a look
        </div>
        <v-layout>
          <v-btn
            elevation="1"
            rounded
            class="py-5 px-10"
            color="amber lighten-2"
          >
            Login as guest
          </v-btn>
        </v-layout>
      </v-layout>
    </section>
    <Guest />
    <Privacy />
  </v-container>
</template>

<script>
import Guest from "@/components/HomeComponents/Guest";
import Privacy from "@/components/HomeComponents/Privacy";

export default {
  name: "Home",
  components: {
    Guest,
    Privacy
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.first-section {
  background: #f3cd7c;
  min-height: 90vh;
  &__title {
    z-index: 1;
    // color: white;
  }
  &__background {
    height: 145vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    clip-path: polygon(100% 0, 100% 13%, 0 50%, 0 0);
    background: #d1ecf3;
  }
}
</style>
