<template>
  <div class="edit-post">
    <v-dialog v-model="dialog" width="600" persistent eager>
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <v-card elevation="4" class="auth-secondarybg pe-4 edit-post-dialog">
        <v-card-title>
          <v-row>
            <v-col cols="2" class="pa-0 ma-0 text-center">
              <img
                src="@/assets/images/avatar.svg"
                width="40"
                color="green"
                class="mt-2"
              />
            </v-col>
            <v-col class="pa-0 ma-0 pe-4" height="100px">
              <v-textarea
                id="EditTextArea"
                autofocus
                append-outer-icon="mdi-close"
                @click:append-outer="clearTextArea"
                placeholder="What's on your mind"
                label=""
                auto-grow
                :rows="
                  parseInt(
                    content.value.length > 100
                      ? content.value.length / 30
                      : content.value.length / 10
                  )
                "
                height="auto"
                counter="5000"
                v-model="content.value"
              />
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

          <Emojis
            :inputModel="content"
            element="EditTextArea"
            nudge-left="320"
            nudge-top="360"
            right
          />

          <DeletePost class="ms-auto" :post="post" :index="index">
            <v-btn
              class="pa-0 px-1 ma-0 caption text-capitalize"
              elevation="0"
              text
              color="red"
              @click="dialog = false"
              height="30"
            >
              Delete
            </v-btn>
          </DeletePost>
          <v-btn
            class="mx-1 px-1 ma-0  text-capitalize"
            elevation="0"
            text
            color="info"
            @click="close"
            height="30"
          >
            Cancel
          </v-btn>
          <v-btn
            :disabled="btnDisabler"
            elevation="0"
            class="white--text"
            color="primary"
            @click="editPost"
            height="30"
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
import Emojis from "@/components/Emojis";

export default {
  components: { DeletePost, Emojis },
  props: {
    post: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  data: props => ({
    dialog: false,
    content: { value: props.post.content },
    isPrivate: props.post.isPrivate
  }),
  computed: {
    togglePrivatePublic() {
      return this.isPrivate ? "private" : "public";
    },
    btnDisabler() {
      return (
        this.content.value === this.post.content &&
        this.isPrivate === this.post.isPrivate
      );
    }
  },
  methods: {
    clearTextArea() {
      this.content.value = "";
    },
    close() {
      this.dialog = false;
      this.content.value = this.post.content;
    },
    async editPost() {
      if (this.content.value.trim() === "" || this.content.value.length < 2)
        return;
      this.dialog = false;
      try {
        const res = await this.$store.dispatch("editPost", {
          content: this.content.value,
          isPrivate: this.isPrivate,
          id: this.post._id,
          index: this.index,
          totalLikes: this.post.totalLikes,
          totalComments: this.post.totalComments
        });
        this.post.content = this.content.value; // fix TypeError
        console.log("Post Edited successfully");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
<style lang="scss">
.container-emoji {
  height: 240px !important;
}

.edit-post-dialog {
  .col {
    max-height: 400px;
    overflow-y: auto;
  }
  .v-text-field__slot {
    textarea {
      word-break: keep-all !important;
    }
  }
}
</style>
