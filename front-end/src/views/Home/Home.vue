<template>
  <div class="home ma-0 pa-0">
    <section class="first-section d-flex justify-center">
      <div class="first-section__background">
        <WaveSvg :fillColor="$theme.currentTheme.bg" />
      </div>
      <v-row class="first-section__header">
        <v-col class="ml-10 align-self-center">
          <h1 class="first-section__title display-2 pb-2 ">
            Lorem ipsum adipisicing
          </h1>
          <h2 class="first-section__title display-1 pb-10">
            amet consectetur adipisicing
          </h2>
          <div>
            <v-btn
              elevation="0"
              rounded
              dark
              class="mt-4 py-6 px-12"
              color="primary"
              to="/sign_up"
            >
              Create an account
            </v-btn>
          </div>
        </v-col>
        <v-col class="align-self-end">
          <SocialSvg width="550" height="420" />
        </v-col>
      </v-row>
    </section>
    <Guest />
    <Privacy />
  </div>
</template>

<script>
import Guest from "@/components/HomeComponents/Guest";
import Privacy from "@/components/HomeComponents/Privacy";
// import svg images
import SocialSvg from "@/components/svg/SocialSvg";
import WaveSvg from "@/components/svg/WaveSvg";

export default {
  name: "Home",
  components: {
    Guest,
    Privacy,

    // svg images
    SocialSvg,
    WaveSvg
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.home {
  .first-section {
    min-height: 80vh;
    position: relative;
    &__background {
      width: 100vw;
      height: 100px;
      z-index: 2;
      position: absolute;
      bottom: -100px;
      left: 0;
    }
  }
}
</style>
