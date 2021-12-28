<template>
  <div class="toggle-like-unlike d-flex align-center">
    <span class="caption">{{ post.likes }}</span>
    <v-btn
      class="ml-1 ps-2 pe-3 text-lowercase body-2"
      elevation="0"
      height="32px"
      color="auth-secondarybg"
      @click="toggleLike"
      :loading="loading"
      :disabled="loading"
    >
      <v-icon left size="16" class="mb-1" color="primary" v-if="liked">
        mdi-arrow-up-thick
      </v-icon>
      <v-icon left size="16" class="mb-1" v-else>
        mdi-arrow-up-thick
      </v-icon>
      {{ toggleLikeUnlike }}
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    post: Object
  },
  data: props => ({
    liked: props.post.likedByViewer,
    loading: false
  }),
  computed: {
    toggleLikeUnlike() {
      return this.liked ? this.$t("liked") : this.$t("like");
    }
  },
  methods: {
    async toggleLike() {
      this.loading = true;
      const api = `/feed/posts/${this.post._id}/likes`;
      try {
        const res = await this.$http.put(api);
        if (res.status === 204) {
          if (this.liked) {
            console.log("Unliked :(");
            this.post.likes--;
          } else {
            console.log("Liked :)");
            this.post.likes++;
          }

          this.liked = !this.liked;
          this.post.likedByViewer = !this.post.likedByViewer;
          this.loading = false;
        }
      } catch (err) {
        console.log("Something went wrong from:LikeUnlike");
        console.log(err);
        this.loading = false;
      }
    }
  }
};
</script>

<style></style>
