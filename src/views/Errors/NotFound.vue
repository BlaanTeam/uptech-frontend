<template>
  <div class="not-found px-2 pt-15 fill-height ">
    <div class="d-flex flex-column mx-auto">
      <p class="display-3 text-center">{{ $t("notFound.h1") }}</p>

      <p class="display-5 text-center">
        {{ $t("notFound.h2") }}
      </p>

      <NotFoudSvg width="400" />
    </div>
  </div>
</template>
<script>
import NotFoudSvg from "@/components/svg/NotFoundSvg";
export default {
  components: {
    NotFoudSvg
  }
};
</script>
<style>
.auth-layout .not-found {
  width: 45vw !important;
}
</style>
