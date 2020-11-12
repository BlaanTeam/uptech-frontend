<template>
  <div class="home ma-0 pa-0">
    <v-container fluid class=" pa-0 ma-0">
      <section class="first-section d-flex align-end pa-4">
        <div class="first-section__background">
          <WaveSvg />
        </div>
        <v-row class="first-section__header">
          <v-col class="ml-10">
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
                color="#e08c04"
                to="/sign_up"
              >
                Create an account
              </v-btn>
            </div>
          </v-col>
          <v-col class="svg-image d-none d-sm-flex">
            <SocialSvg />
          </v-col>
        </v-row>
      </section>
    </v-container>
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
    padding: 0 0 50px 0 !important;
    min-height: 80vh;
    position: relative;
    &__background {
      width: 100vw;
      height: 100px;
      z-index: 2;
      position: absolute;
      bottom: -100px;
      left: 0;
      #wave-one {
        fill: white;
      }
    }
  }
}
</style>
