<template>
  <div class="toggle-like-unlike">
    <span class="caption">{{ post.likes }}</span>
    <v-btn
      class="ml-2 px-4 py-0  text-lowercase body-2"
      elevation="0"
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
      return this.liked ? "unlike" : "like";
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
