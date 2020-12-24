<template>
  <div class="feeds">
    <CreatePost />
    <Posts />
  </div>
</template>

<script>
import CreatePost from "@/components/AuthComponents/CreatePost";
import Posts from "@/components/AuthComponents/Posts";

export default {
  components: { CreatePost, Posts }
};
</script>

<style lang="scss"></style>
