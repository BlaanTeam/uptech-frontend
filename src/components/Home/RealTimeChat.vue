<template>
  <section class="real-time-chat pa-4 secondarybg">
    <v-row class="align-center">
      <v-col class="mt-4 image">
        <RealTimeChatSvg />
      </v-col>
      <v-col class="px-8">
        <h1 class="display-2 py-2 font-weight-regular">
          {{ $t("home.section2.h1") }}
        </h1>
        <p class="display-1 font-weight-light">
          {{ $t("home.section2.text") }}
        </p>
      </v-col>
    </v-row>
    <div class="real-time-chat__background">
      <WaveSvg :fillColor="$theme.currentTheme.secondarybg" />
    </div>
  </section>
</template>

<script>
import WaveSvg from "@/components/svg/WaveSvg";
import RealTimeChatSvg from "@/components/svg/RealTimeChatSvg";

export default {
  components: {
    WaveSvg,
    RealTimeChatSvg
  }
};
</script>
<style lang="scss">
.real-time-chat {
  min-height: 80vh;
  position: relative;
  padding: 100px 0 60px 0;
  z-index: 1;
  .image {
    svg {
      margin-top: 100px;
      width: 600px;
    }
  }
  &__background {
    width: 100vw;
    z-index: 2;
    position: absolute;
    bottom: -10vw;
    left: 0;
  }
}
@media screen and (max-width: 700px) {
  .real-time-chat {
    .image {
      svg {
        width: 80vw;
        margin-left: 5vw;
      }
    }
  }
}
</style>
