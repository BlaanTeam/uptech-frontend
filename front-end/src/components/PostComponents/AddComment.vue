<template>
  <v-expand-transition>
    <v-row
      v-show="display"
      :class="' me-2 ms-12 ma-0 pa-0 add-comment' + post._id"
    >
      <v-col cols="1" class=" pa-0 ma-0">
        <v-avatar width="20" color="green" class="mt-3">
          <span class="white--text headline">me</span>
        </v-avatar>
      </v-col>
      <v-col cols="8" class="pa-0 ma-0 ms-2">
        <v-row no-gutters>
          <v-col>
            <v-textarea
              ref="addCommentTextArea"
              autofocus
              placeholder="What you do think"
              label=""
              rows="1"
              row-height="10"
              v-model="comment"
              auto-grow
            ></v-textarea>
          </v-col>
          <v-col cols="1" class="align-self-center">
            <v-menu
              :close-on-content-click="false"
              offset-y
              left
              :attach="'.add-comment' + post._id"
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  class="mx-1 float-right"
                  color="white"
                >
                  😀
                </v-btn>
              </template>

              <VEmojiPicker
                :dark="$vuetify.theme.isDark"
                @select="selectEmoji"
                width="400px"
              />
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="ma-0 pa-0 align-self-center ms-4">
        <v-btn
          class="pa-0 px-2"
          @click="addComment()"
          elevation="0"
          color="primary"
        >
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-expand-transition>
</template>

<script>
export default {
  props: {
    post: Object,
    display: Boolean
  },
  data: () => ({
    comment: "",
    selectionStart: null,
    selected: false
  }),
  methods: {
    selectEmoji(emoji) {
      let el = this.$refs.addCommentTextArea.$refs.input;

      if (this.selected) this.selectionStart = el.selectionStart;
      else if (!this.selected && this.selectionStart === null)
        this.selectionStart = el.selectionStart;

      this.comment =
        this.comment.substring(0, el.selectionStart) +
        this.comment.substring(el.selectionEnd);

      let before = this.comment.substring(0, this.selectionStart);
      let after = this.comment.substring(this.selectionStart);

      this.comment = before + emoji.data + after;
      this.selectionStart += 2;

      this.selected = false;
    },

    async addComment() {
      if (!this.comment.trim()) return (this.comment = "");

      const api = `/feed/posts/${this.post._id}/comments`;
      const data = { commentBody: this.comment };
      try {
        const res = await this.$http.post(api, data);

        if (res.status === 200) {
          console.log("Comment added successfully");
          this.post.totalComments++;
          if (!this.post.comments) this.post.comments = [];
          this.post.comments.push(res.data.comment);
          this.comment = "";
        }
      } catch (err) {
        console.log("Something went wrong from:AddComment");
        console.log(err);
      }
    }
  },
  mounted() {
    let el = this.$refs.addCommentTextArea.$refs.input;
    el.onclick = () => {
      this.selected = true;
    };
  }
};
</script>

<style></style>
