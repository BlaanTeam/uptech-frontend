<template>
  <div class="search auth-secondarybg">
    <span>{{ $t("search") }}</span>
  </div>
</template>

<script>
export default {};
</script>

<style>
.search {
  overflow: hidden;
  position: fixed;
  top: 2px;
  border-radius: 10px;
  width: 100%;
  max-width: 360px;
  height: 45px;
  max-height: 45px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-weight: 300;
  font-size: 15px;
}
</style>
