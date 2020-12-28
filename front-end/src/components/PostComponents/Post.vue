<template>
  <v-card class="mb-2 secondarybg" :id="'card' + index">
    <v-card-title :class="'ma-0 card-title' + index">
      <PopoverProfile>
        <router-link to="profile/5543541">
          <v-avatar width="40" color="red">
            <span class="white--text headline">av</span>
          </v-avatar>
        </router-link>
      </PopoverProfile>
      <div class="ms-4 post__info">
        <router-link to="profile/5543541">
          <PopoverProfile>
            <h3 dense class="pa-0 ma-0">John doe</h3>
          </PopoverProfile>
        </router-link>
        <h4 dense class="caption pa-0 ma-0">
          <timeago :datetime="post.createdAt" :auto-update="60" />
        </h4>
      </div>
      <v-spacer></v-spacer>
      <v-menu
        :attach="'.card-title' + index"
        nudge-right="25"
        offset-y
        left
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            class="secondarybg"
            elevation="0"
            icon
          >
            <v-icon size="40">mdi-dots-horizontal</v-icon>
          </v-btn>
        </template>
        <v-list-item-group class="text-center secondarybg" active-class="">
          <v-list-item dense>
            <v-list-item-title>Copy link</v-list-item-title>
          </v-list-item>
          <v-list-item dense>
            <v-list-item-title>Save</v-list-item-title>
          </v-list-item>
          <EditPost
            :post="post"
            :index="index"
            v-if="post.postUser._id === userId"
          >
            <v-list-item dense>
              <v-list-item-title>Edit</v-list-item-title>
            </v-list-item>
          </EditPost>
          <DeletePost
            :post="post"
            :index="index"
            v-if="post.postUser._id === userId"
          >
            <v-list-item dense>
              <v-list-item-title class="red--text">
                Delete
              </v-list-item-title>
            </v-list-item>
          </DeletePost>
        </v-list-item-group>
      </v-menu>
    </v-card-title>

    <v-card-text class="headline ps-6">
      {{ postBody }}
      <a
        id="read-more"
        text
        v-if="post.postBody.length > 400"
        @click="readActivated = !readActivated"
        class="mx-auto"
        v-html="toggleMoreLess"
      >
      </a>
    </v-card-text>

    <v-divider></v-divider>
    <v-card-actions class="px-4 py-0">
      <v-row class="text-center py-0">
        <v-col class="pa-2">
          <div>
            {{ post.totalLikes }}
            <v-btn
              class="ml-2 px-4 py-0 caption"
              elevation="0"
              color="secondarybg"
              @click="toggleLike"
            >
              <v-icon left size="20" class="mb-1" color="primary" v-if="liked">
                mdi-arrow-up-thick
              </v-icon>
              <v-icon left size="20" class="mb-1" v-else>
                mdi-arrow-up-thick
              </v-icon>
              {{ !liked ? "Like" : "Unlike" }}
            </v-btn>
          </div>
        </v-col>
        <v-col class="pa-2">
          <div>
            {{ post.totalComments }}
            <v-btn
              class="ml-2 caption"
              @click="commentExpanded = !commentExpanded"
              elevation="0"
              color="secondarybg"
            >
              <v-icon left size="20">mdi-comment</v-icon>
              comment
            </v-btn>
          </div>
        </v-col>
        <v-col class="pa-2">
          <v-btn elevation="0" color="secondarybg caption">
            <v-icon left size="20">mdi-share-variant</v-icon>
            share
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-expand-transition>
      <v-row v-show="commentExpanded" class="my-1 ms-10">
        <v-col cols="1" class=" pa-0 ma-0">
          <v-avatar width="20" color="green" class="mt-3">
            <span class="white--text headline">me</span>
          </v-avatar>
        </v-col>
        <v-col cols="8" class="pa-0 ma-0 ms-2">
          <div>
            <v-textarea
              autofocus
              placeholder="What you do think"
              label=""
              rows="1"
              row-height="10"
              v-model="comment"
              auto-grow
            ></v-textarea>
          </div>
        </v-col>
        <v-col cols="2" class="ma-0 pa-0 align-self-center ms-4">
          <v-btn
            @click="addComment(post, index)"
            class="pa-0 px-2"
            elevation="0"
            color="primary"
          >
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-expand-transition>
  </v-card>
</template>

<script>
import EditPost from "./EditPost";
import PopoverProfile from "./PopoverProfile";
import DeletePost from "./DeletePost";

export default {
  components: {
    EditPost,
    PopoverProfile,
    DeletePost
  },
  props: {
    post: Object,
    index: Number
  },
  data: props => ({
    comment: "",
    commentExpanded: false,
    readActivated: false,
    liked: props.post.isLiked
  }),

  computed: {
    userId() {
      return this.$store.getters.getUserId;
    },
    postBody() {
      if (this.post.postBody.length > 400 && !this.readActivated) {
        return this.post.postBody.slice(0, 400) + "...";
      } else return this.post.postBody;
    },
    toggleMoreLess() {
      if (!this.readActivated) return "read&nbsp;more";
      else return "read&nbsp;less";
    }
  },
  methods: {
    async addComment(post, index) {
      if (!this.comment.trim()) return (this.comment = "");
      try {
        const res = await this.$store.dispatch("addComment", {
          comment: this.comment,
          index: index,
          id: post._id
        });
        this.comment = "";
      } catch (err) {
        console.log(err);
      }
    },
    async toggleLike() {
      try {
        this.liked = !this.liked;
        const res = await this.$store.dispatch("toggleLike", {
          liked: this.liked,
          index: this.index,
          id: this.post._id
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss"></style>
