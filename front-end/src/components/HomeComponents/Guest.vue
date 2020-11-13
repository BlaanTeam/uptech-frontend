<template>
  <v-container fluid class="guest d-flex secondarybg">
    <div class="guest__background">
      <WaveSvg :fillColor="$theme.currentTheme.secondarybg" />
    </div>
    <v-row class="align-center">
      <v-col cols="5" offset="1" class="mt-4 image">
        <GuestSvg />
      </v-col>
      <v-col cols="5">
        <h1 class="display-2 py-2">Login as guest</h1>
        <p class="display-1">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores
          aliquid, blanditiis, necessitatibus eveniet debitis voluptas mollitia
          laudantium dignissimos quaerat reprehenderit repellat laboriosam ad
          saepe ipsa, iusto sapiente placeat sint vero!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import WaveSvg from "@/components/svg/WaveSvg";
import GuestSvg from "@/components/svg/GuestSvg";

export default {
  components: {
    WaveSvg,
    GuestSvg
  }
};
</script>
<style lang="scss">
.guest {
  min-height: 80vh;
  position: relative;
  padding: 100px 0 60px 0;
  z-index: 1;
  .image {
    svg {
      width: 500px;
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
</style>
