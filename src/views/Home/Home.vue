<template>
  <div class="home ma-0 pa-0 ">
    <section class="first-section pa-4 px-10 ">
      <v-row class="first-section__header app-width">
        <v-col class="align-self-center">
          <h1
            class="first-section__title display-2 text--primary pb-2 font-weight-regular"
          >
            {{ $t("home.section1.h1") }}
          </h1>
          <h2 class="first-section__title display-1 text--secondary pb-10">
            {{ $t("home.section1.h2") }}
          </h2>
          <div>
            <v-btn
              elevation="0"
              rounded
              class="mt-4 py-6 px-12 white--text"
              color="primary"
              to="/sign_up"
            >
              {{ $t("home.section1.btn") }}
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <SocialSvg width="500" height="420" />
        </v-col>
      </v-row>
      <div class="first-section__background">
        <WaveSvg :fillColor="$theme.currentTheme.bg" />
      </div>
    </section>
    <RealTimeChat class="px-10" />
  </div>
</template>

<script>
import RealTimeChat from "@/components/Home/RealTimeChat";
import SocialSvg from "@/components/svg/SocialSvg";
import WaveSvg from "@/components/svg/WaveSvg";

export default {
  name: "Home",
  components: {
    RealTimeChat,
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
    padding-top: 8vh !important;
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
