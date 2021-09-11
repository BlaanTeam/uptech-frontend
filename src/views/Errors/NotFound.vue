<template>
  <v-container fluid class="not-found pa-0 fill-height">
    <div class="d-flex flex-column mx-auto">
      <p class="display-3 text-center">{{ $t("notFound.h1") }}</p>

      <p class="display-5 text-center">
        {{ $t("notFound.h2") }}
      </p>
      <v-spacer></v-spacer>

      <NotFoudSvg width="400" />
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
