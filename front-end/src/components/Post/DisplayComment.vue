<template>
  <div class="display-comments py-2" :id="'comment' + comment._id">
    <v-row class="ms-10" no-gutters>
      <v-col cols="1" class="">
        <v-avatar width="20" color="green">
          <span class="white--text caption">
            {{ comment.commentUser.userName.slice(0, 4) }}
          </span>
        </v-avatar>
      </v-col>
      <v-col cols="9" class="auth-bg rounded-lg ps-3 pe-2 mx-1 pt-1 pb-2">
        <v-row no-gutters>
          <span text class="body-2 font-weight-bold">
            {{ comment.commentUser.userName }}
          </span>
        </v-row>
        <v-row no-gutters>
          <v-row v-if="editMode" no-gutters>
            <v-col>
              <v-textarea
                id="EditCommentTextArea"
                autofocus
                label=""
                auto-grow
                :rows="1"
                v-model="commentBody.value"
              ></v-textarea>
            </v-col>
            <v-col cols="1" class="ms-1 align-self-center">
              <Emojis
                id="EditCommentEmojis"
                left
                :attach="'#comment' + comment._id"
                element="EditCommentTextArea"
                :inputModel="commentBody"
              />
            </v-col>
            <v-col cols="1" class="align-self-center">
              <v-btn
                :disabled="comment.commentBody === commentBody.value"
                icon
                @click="editComment()"
              >
                <v-icon color="primary" class="ms-1">mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <p v-else class="body-2 font-weight-light ma-0">
            {{ comment.commentBody }}
          </p>
        </v-row>
      </v-col>

      <v-col cols="1" class="align-self-center">
        <v-menu
          :attach="'#comment' + comment._id"
          nudge-right="25"
          offset-y
          left
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="
                userId === post.postUser._id ||
                  userId === comment.commentUser._id
              "
              v-bind="attrs"
              v-on="on"
              class="auth-secondarybg"
              elevation="0"
              icon
            >
              <v-icon size="40">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list-item-group class="auth-secondarybg">
            <v-list-item
              dense
              v-if="editMode && userId === comment.commentUser._id"
              @click="editMode = false"
            >
              <v-icon left small color="blue">mdi-file-undo</v-icon>
              <v-list-item-title class="blue--text">cancel</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="userId === comment.commentUser._id"
              dense
              @click="editMode = true"
            >
              <v-icon left small>mdi-square-edit-outline</v-icon>
              <v-list-item-title>edit</v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="
                userId === comment.commentUser._id ||
                  userId === post.postUser._id
              "
              dense
              @click="deleteComment()"
            >
              <v-icon left small color="red">mdi-delete</v-icon>
              <v-list-item-title class="red--text">delete</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-menu>
      </v-col>
      <v-row no-gutters>
        <v-col cols="4" class="ms-auto text-end pe-2">
          <timeago
            class="font-weight-light text--disabled caption"
            :datetime="comment.createdAt"
            :auto-update="60"
          />
        </v-col>
        <v-col cols="2"></v-col>
      </v-row>
    </v-row>
  </div>
</template>

<script>
import Emojis from "@/components/Emojis.vue";
export default {
  components: { Emojis },
  props: {
    comment: { type: Object, required: true },
    post: { type: Object, required: true }
  },
  data: props => ({
    editMode: false,
    commentBody: { value: props.comment.commentBody }
  }),
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    async editComment() {
      if (!this.commentBody.value.trim()) return (this.commentBody.value = "");
      const api = `/feed/posts/${this.post._id}/comments/${this.comment._id}`;
      const data = { commentBody: this.commentBody.value };
      try {
        const res = await this.$http.put(api, data);

        if (res.status === 200) {
          console.log("Comment Updated successfully");
          this.comment.commentBody = res.data.commentBody;
          this.editMode = false;
        }
      } catch (err) {
        console.log("Something went wrong from:UpdateComment");
        console.log(err);
      }
    },
    async deleteComment() {
      const api = `/feed/posts/${this.post._id}/comments/${this.comment._id}`;
      try {
        const res = await this.$http.delete(api);
        if (res.status === 204) {
          console.log("Comment deleted successfully");

          // let el = document.getElementById("comment" + this.comment._id);
          // console.log(el);
          // el.style.transition = "all 0.4s";
          // el.style.transform = "translateX(-100vh";
          // el.style.opacity = "0";
          // setTimeout(() => {
          // el.remove();
          this.post.comments = this.post.comments.filter(
            comment => comment._id !== this.comment._id
          );
          this.post.totalComments--;
          // }, 300);
        }
      } catch (err) {
        console.log("Something went wrong from:DeleteComment");
        console.log(err);
      }
    }
  }
};
</script>

<style>
.display-comments[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
</style>
