<template>
  <div class="home ma-0 pa-0">
    <section class="first-section pa-4">
      <v-row class="first-section__header">
        <v-col class="ms-1 align-self-center">
          <h1
            class="first-section__title text-lg-h2 text-xl-h1 text--primary pb-2 font-weight-regular"
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
              dark
              class="mt-4 py-6 px-12"
              color="primary"
              to="/sign_up"
            >
              {{ $t("home.section1.btn") }}
            </v-btn>
          </div>
        </v-col>
        <v-col class="align-self-end">
          <SocialSvg width="500" height="420" />
        </v-col>
      </v-row>
      <div class="first-section__background">
        <WaveSvg :fillColor="$theme.currentTheme.bg" />
      </div>
    </section>
    <RealTimeChat />
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
@media screen and (max-width: 700px) {
  .home {
    .first-section {
      margin-top: 50px;
    }
  }
}
</style>
