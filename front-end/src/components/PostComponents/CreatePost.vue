<template>
  <v-card class="create__post my-10 secondarybg">
    <v-card-title class="ma-0 d-inline-block float-left">
      <v-avatar width="40" color="green">
        <span class="white--text caption">
          test
        </span>
      </v-avatar>
    </v-card-title>
    <v-card-subtitle class="ms-10 ps-4 pt-3 d-block">
      <v-textarea
        ref="CreateTextArea"
        placeholder="What's on your mind"
        label=""
        auto-grow
        rows="1"
        :append-outer-icon="postBody.length > 1 ? 'mdi-close' : ''"
        @click:append-outer="clearTextArea"
        row-height="10"
        counter="5000"
        v-model="postBody"
      ></v-textarea>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            elevation="0"
            class="ms-4 me-2 options"
            @click="isPrivate = !isPrivate"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="!isPrivate" size="20" color="info">
              mdi-earth
            </v-icon>
            <v-icon v-else size="20" color="#05bd58">mdi-lock</v-icon>
          </v-btn>
        </template>
        <span>{{ togglePrivatePublic }}</span>
      </v-tooltip>

      <v-menu
        :close-on-content-click="false"
        offset-y
        attach=".create__post"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" icon class="mx-1" color="white">
            😀
          </v-btn>
        </template>

        <VEmojiPicker
          :dark="$vuetify.theme.isDark"
          @select="selectEmoji"
          width="400px"
        />
      </v-menu>
      <v-btn
        :disabled="postBody && postBody.length < 2"
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
    isPrivate: false,
    displayEmojis: false,
    select: false,
    selectionStart: null
  }),
  computed: {
    togglePrivatePublic() {
      return this.isPrivate ? "private" : "public";
    }
  },
  methods: {
    clearTextArea() {
      this.postBody = "";
      return;
    },
    selectEmoji(emoji) {
      let el = this.$refs.CreateTextArea.$refs.input;

      if (this.select) this.selectionStart = el.selectionStart;
      else if (!this.select && !this.selectionStart)
        this.selectionStart = el.selectionStart;

      this.postBody =
        this.postBody.substring(0, el.selectionStart) +
        this.postBody.substring(el.selectionEnd, this.postBody.length);

      let before = this.postBody.substring(0, this.selectionStart);
      let after = this.postBody.substring(
        this.selectionStart,
        this.postBody.length
      );

      this.postBody = before + emoji.data + after;
      this.select = false;
    },
    async createPost() {
      if (this.postBody.trim().length < 2) return;
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
  },
  mounted() {
    let el = this.$refs.CreateTextArea.$refs.input;
    el.onclick = () => {
      this.select = true;
    };
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
  .container-emoji {
    height: 280px !important;
  }
}
</style>
