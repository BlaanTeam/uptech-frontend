<template>
  <div class="toggle-like-unlike">
    {{ post.totalLikes }}
    <v-btn
      class="ml-2 px-4 py-0 caption"
      elevation="0"
      color="auth-secondarybg"
      @click="toggleLike"
    >
      <v-icon left size="20" class="mb-1" color="primary" v-if="liked">
        mdi-arrow-up-thick
      </v-icon>
      <v-icon left size="20" class="mb-1" v-else>
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
    liked: props.post.isLiked
  }),
  computed: {
    toggleLikeUnlike() {
      return this.liked ? "unlike" : "like";
    }
  },
  methods: {
    async toggleLike() {
      const api = `/feed/posts/${this.post._id}/like`;
      try {
        const res = await this.$http.post(api);
        if (res.status === 200) {
          if (this.liked) {
            console.log("Unliked :(");
            this.post.totalLikes--;
          } else {
            console.log("Liked :)");
            this.post.totalLikes++;
          }

          this.liked = !this.liked;
        }
      } catch (err) {
        console.log("Something went wrong from:LikeUnlike");
        console.log(err);
      }
    }
  }
};
</script>

<style></style>
