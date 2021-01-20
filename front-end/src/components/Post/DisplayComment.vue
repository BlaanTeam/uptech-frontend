<template>
  <div class="display-comments py-2" :id="'comment' + comment._id">
    <v-row class="ms-10" no-gutters>
      <v-col cols="1" class="">
        <v-avatar width="20" color="green">
          <span class="white--text caption">
            {{ comment.user.userName.slice(0, 4) }}
          </span>
        </v-avatar>
      </v-col>
      <v-col cols="9" class="auth-bg rounded-lg ps-3 pe-2 mx-1 pt-1 pb-2">
        <v-row no-gutters>
          <span text class="body-2 font-weight-bold">
            {{ comment.user.userName }}
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
                v-model="content.value"
              ></v-textarea>
            </v-col>
            <v-col cols="1" class="ms-1 align-self-center">
              <Emojis
                id="EditCommentEmojis"
                left
                :attach="'#comment' + comment._id"
                element="EditCommentTextArea"
                :inputModel="content"
              />
            </v-col>
            <v-col cols="1" class="align-self-center">
              <v-btn
                :disabled="comment.content === content.value || loading"
                icon
                :loading="loading"
                @click="editComment()"
              >
                <v-icon color="primary" class="ms-1">mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <p v-else class="body-2 font-weight-light ma-0">
            {{ comment.content }}
          </p>
        </v-row>
      </v-col>

      <v-col cols="1" class="align-self-center">
        <v-menu
          :attach="'#comment' + comment._id"
          nudge-right="25"
          offset-y
          :close-on-content-click="false"
          left
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-show="post.isOwner || userId === comment.user._id"
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
            <v-btn
              text
              block
              tile
              color="blue"
              dense
              class="text-capitalize subtitle-2 justify-start"
              v-if="editMode && userId === comment.user._id"
              @click="editMode = false"
            >
              <v-icon left small>mdi-file-undo</v-icon>
              cancel
            </v-btn>
            <v-btn
              v-if="userId === comment.user._id"
              dense
              text
              block
              tile
              class="text-capitalize subtitle-2 justify-start"
              @click="editMode = true"
            >
              <v-icon left small>mdi-square-edit-outline</v-icon>
              edit
            </v-btn>
            <v-btn
              v-if="userId === comment.user._id || post.isOwner"
              dense
              color="red"
              text
              block
              tile
              @click="deleteComment()"
              :loading="loading"
              :disabled="loading"
              class="text-capitalize subtitle-2 justify-start"
            >
              <v-icon left small color="red">mdi-delete</v-icon>
              delete
            </v-btn>
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
    content: { value: props.comment.content },
    loading: false
  }),
  computed: {
    userId() {
      return this.$store.getters.getUserId;
    }
  },
  methods: {
    async editComment() {
      if (!this.content.value.trim()) return (this.content.value = "");
      const api = `/feed/posts/${this.post._id}/comments/${this.comment._id}`;
      const data = { content: this.content.value };
      try {
        this.loading = true;
        const res = await this.$http.put(api, data);

        if (res.status === 200) {
          console.log("Comment Updated successfully");
          this.comment.content = res.data.content;
          this.loading = false;
          this.editMode = false;
        }
      } catch (err) {
        console.log("Something went wrong from:UpdateComment");
        this.loading = false;
        console.log(err);
      }
    },
    async deleteComment() {
      const api = `/feed/posts/${this.post._id}/comments/${this.comment._id}`;
      try {
        this.loading = true;
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
          this.post.commentsData = this.post.commentsData.filter(
            comment => comment._id !== this.comment._id
          );
          this.post.comments--;
          this.loading = false;

          // }, 300);
        }
      } catch (err) {
        console.log("Something went wrong from:DeleteComment");
        this.loading = false;
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
