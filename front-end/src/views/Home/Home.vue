<template>
  <v-container fluid class="home pa-0 white--text">
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
            color="#e08c04"
            to="/sign_up"
          >
            Create an account
          </v-btn>
        </v-layout>
        <div class="display-5 ma-4 mt-15 ">
          I'm curious, just want to take a look
        </div>
        <v-layout>
          <v-btn elevation="1" rounded class="py-5 px-10" color="#1f8a7d" dark>
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
  background: #1a796e;
  min-height: 91vh;
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
    background: #1e3a46;
    // background: linear-gradient(0deg, rgb(16, 21, 24) 0%, rgb(47, 52, 58) 100%);
  }
}
</style>
