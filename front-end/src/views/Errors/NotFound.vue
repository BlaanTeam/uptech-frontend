<template>
  <v-container fluid class="not-found pa-0 fill-height">
    <div class="d-flex flex-column mx-auto">
      <p class="display-3 text-center">WHOOPS !</p>
      <p class="display-5 text-center">
        The page you are trying to get to never existed in this reality, or has
        migrated to a parallel universe.
      </p>
      <v-spacer></v-spacer>
      <NotFoudSvg />
    </div>
  </v-container>
</template>
<script>
import NotFoudSvg from "@/components/svg/NotFoundSvg";
export default {
  components: {
    NotFoudSvg
  }
};
</script>

<style lang="scss" scoped></style>
