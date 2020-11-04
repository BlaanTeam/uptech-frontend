<template>
  <v-container fluid class="privacy mt-10 py-10 d-flex">
    <v-row class="align-center">
      <v-col cols="5" offset="1" class="mt-4">
        <img
          src="@/assets/images/privacy.svg"
          alt="privacy illustration"
          width="350"
        />
      </v-col>
      <v-col cols="5">
        <h1 class="display-2 py-2">Privacy our first priority</h1>
        <p class="display-1">
          We take care of our users and we try as much as we can to protect you
          from tracking, make sure that your data are safe we do analyze them or
          selling them for any porposes
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.privacy {
  min-height: 100vh;
  clip-path: polygon(100% 0%, 0% 0%, 0% 100%, 100% 100%);
  background: #1e3a46;
}
</style>
