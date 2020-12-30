<template>
  <div class="view-post">
    view post
  </div>
</template>

<script>
export default {
  name: "ViewPost",
  beforeCreate() {
    this.$http
      .get(`/feed/posts/${this.$route.params.postId}`)
      .then(console.log)
      .catch(console.log);
  }
};
</script>

<style scoped></style>
