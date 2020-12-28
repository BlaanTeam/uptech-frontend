<template>
  <v-card class="create__post my-10 secondarybg">
    <v-card-title class="ma-0 d-inline-block float-left">
      <v-avatar width="40" color="green">
        <span class="white--text headline">me</span>
      </v-avatar>
    </v-card-title>
    <v-card-subtitle class="ms-10 ps-4 pt-3 d-block">
      <v-textarea
        placeholder="What's on your mind"
        label=""
        auto-grow
        rows="1"
        row-height="10"
        counter="5000"
        v-model="postBody"
      ></v-textarea>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-btn
        icon
        elevation="0"
        class="ms-4 me-2 options"
        @click="isPrivate = !isPrivate"
      >
        <v-icon v-if="!isPrivate" size="20" color="#04c0b0">mdi-earth</v-icon>
        <v-icon v-else size="20" color="#05bd58">mdi-lock</v-icon>
      </v-btn>

      <v-btn icon elevation="0" class="mx-1">
        <v-icon size="20" color="primary">mdi-emoticon-outline</v-icon>
      </v-btn>
      <v-btn
        :disabled="postBody.length < 2"
        @click="createPost"
        class="ms-auto primary"
        elevation="0"
      >
        Post
        <v-icon right>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    postBody: "",
    isPrivate: false
  }),
  methods: {
    async createPost() {
      try {
        const res = await this.$store.dispatch("createPost", {
          postBody: this.postBody,
          isPrivate: this.isPrivate
        });
        if (res.status === 201) {
          console.log("Post Created");
          this.postBody = "";
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss">
.create__post {
  .v-input__slot::before {
    content: unset !important;
  }
  // .v-input__slot::after {
  //   content: unset !important;
  //
  .options {
    position: relative !important;
  }
  .menu-list {
    position: absolute !important;
  }
}
</style>
