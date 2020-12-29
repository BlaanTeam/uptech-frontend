<template>
  <div class="edit-post">
    <v-dialog v-model="dialog" width="600" persistent eager>
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <v-card elevation="4" class="secondarybg pe-4 edit-post-dialog">
        <v-card-title>
          <v-row>
            <v-col cols="2" class="pa-0 ma-0 text-center">
              <v-avatar width="40" color="green" class="mt-2">
                <span class="white--text caption">
                  {{ post.postUser.userName.slice(0, 4) }}
                </span>
              </v-avatar>
            </v-col>
            <v-col class="pa-0 ma-0 pe-4" height="100px">
              <v-textarea
                ref="EditTextArea"
                autofocus
                append-outer-icon="mdi-close"
                @click:append-outer="clearTextArea"
                placeholder="What's on your mind"
                label=""
                auto-grow
                :rows="parseInt(postBody.length / 30)"
                height="auto"
                counter="5000"
                v-model="postBody"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-card-title>

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
                <v-icon v-if="!isPrivate" size="20" color="#04c0b0">
                  mdi-earth
                </v-icon>
                <v-icon v-else size="20" color="#05bd58">mdi-lock</v-icon>
              </v-btn>
            </template>
            <span>{{ togglePrivatePublic }}</span>
          </v-tooltip>

          <v-menu
            :close-on-content-click="false"
            right
            transition="slide-y-transition"
            nudge-left="320"
            nudge-top="280"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                icon
                elevation="0"
                class="mx-1 emoji-btn"
              >
                😀
              </v-btn>
            </template>
            <VEmojiPicker :dark="$vuetify.theme.isDark" @select="selectEmoji" />
          </v-menu>

          <DeletePost class="ms-auto" :post="post" :index="index">
            <v-btn
              class="pa-0 px-1 ma-0 caption text-capitalize"
              elevation="0"
              dark
              text
              color="red"
              @click="dialog = false"
            >
              Delete
            </v-btn>
          </DeletePost>
          <v-btn
            class="mx-1 px-1 ma-0  text-capitalize"
            elevation="0"
            dark
            text
            color="info"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="postBody === post.postBody"
            elevation="0"
            dark
            color="primary"
            @click="editPost"
          >
            <v-icon left size="20">mdi-content-save</v-icon>
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DeletePost from "./DeletePost";
export default {
  components: { DeletePost },
  props: {
    post: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data: props => ({
    dialog: false,
    postBody: props.post.postBody,
    isPrivate: false,
    selected: false,
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
    },
    selectEmoji(emoji) {
      let el = this.$refs.EditTextArea.$refs.input;

      if (this.selected) this.selectionStart = el.selectionStart;
      else if (!this.selected && this.selectionStart === null)
        this.selectionStart = el.selectionStart;

      this.postBody =
        this.postBody.substring(0, el.selectionStart) +
        this.postBody.substring(el.selectionEnd);

      let before = this.postBody.substring(0, this.selectionStart);
      let after = this.postBody.substring(this.selectionStart);

      this.postBody = before + emoji.data + after;
      this.selectionStart += 2;

      this.selected = false;
    },
    async editPost() {
      if (this.postBody.trim() === "" || this.postBody.length < 2) return;
      this.dialog = false;
      try {
        const res = await this.$store.dispatch("editPost", {
          postBody: this.postBody,
          isPrivate: this.isPrivate,
          id: this.post._id,
          index: this.index,
          totalLikes: this.post.totalLikes,
          totalComments: this.post.totalComments
        });
        this.post.postBody = this.postBody;
        console.log("Post Edited successfully");
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    let el = this.$refs.EditTextArea.$refs.input;
    el.onclick = () => {
      this.selected = true;
    };
  }
};
</script>
<style lang="scss">
.container-emoji {
  height: 180px !important;
}

.edit-post-dialog {
  .col {
    max-height: 400px;
    overflow-y: auto;
  }
  // .v-text-field__slot {
  //   // padding: 0 20px 0 0;
  //   textarea {
  //     word-break: keep-all !important;
  //   }
  // }
}
</style>
