<template>
  <div class="trending auth-secondarybg">
    <div class="soon">{{ $t("soon") }}</div>
    <div class="title">Trends for you</div>
    <div class="trend">
      <span class="font-weight-light caption">
        Trending in Morocco
      </span>
      <span>#NFTdrop</span>
      <span class="font-weight-light caption">128K Posts</span>
    </div>
    <div class="trend" v-for="i in 2" :key="i">
      <span class="font-weight-light caption">
        Technology · Trending
      </span>
      <span>{{ $t("appName") }}</span>
      <span class="font-weight-light caption">561K Posts</span>
    </div>
    <div class="trend" v-for="i in 3" :key="i + 4">
      <span class="font-weight-light caption">
        Trending in Morocco
      </span>
      <span>#Morocco</span>
      <span class="font-weight-light caption">1,437 Posts</span>
    </div>
    <div class="mt-2">
      <span class="primary--text">See more</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.trending {
  overflow: hidden;
  position: fixed;
  border-radius: 10px;
  max-width: 360px;
  width: 100%;
  height: 100%;
  max-height: 90vh;
  padding: 10px 20px;
  margin-top: 52px;
  display: flex;
  flex-direction: column;
  max-height: 590px;
}
.trending .trend {
  display: flex;
  flex-direction: column;
  margin: 10px 0;
}
.soon {
  position: absolute;
  right: -20px;
  top: 4px;
  transform: rotate(45deg);
  background: rgb(2, 179, 82);
  padding: 0px 20px 1px 20px;
}
</style>
