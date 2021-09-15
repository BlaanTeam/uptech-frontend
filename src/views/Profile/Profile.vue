<template>
  <div>
    <keep-alive>
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
  </div>
</template>
<script>
export default {
  name: "Profile"
};
</script>
