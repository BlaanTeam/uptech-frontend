<template>
  <v-card class="mb-2 secondarybg" :id="'card' + index">
    <v-card-title :class="'ma-0 card-title' + index">
      <v-row no-gutters>
        <v-col lg="1" md="1" sm="2" class="pa-0 ma-0 ms-2">
          <PopoverProfile :index="index">
            <router-link
              :to="{
                name: 'ViewProfile',
                params: { userId: post.postUser._id }
              }"
            >
              <v-avatar width="40" color="red">
                <span class="white--text caption">
                  {{ post.postUser.userName.slice(0, 4) }}
                </span>
              </v-avatar>
            </router-link>
          </PopoverProfile>
        </v-col>
        <v-col lg="3" md="3" sm="5" class="pa-0 ma-0 ms-1 mt-n1">
          <router-link
            :to="{
              name: 'ViewProfile',
              params: { userId: post.postUser._id }
            }"
            class="pa-0 ma-0"
          >
            <h5 class="font-weight-medium d-inline-block">
              {{ post.postUser.userName }}
            </h5>
          </router-link>
          <p class="caption font-weight-light pa-0 mt-n2 ma-0 d-block">
            <timeago :datetime="post.createdAt" :auto-update="60" />
          </p>
        </v-col>
        <v-spacer></v-spacer>
        <v-col lg="1" md="1" sm="2" class="pa-0 ma-0 text-center">
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
            <v-list-item-group class="text-center secondarybg">
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
        </v-col>
      </v-row>
    </v-card-title>

    <div class="headline ps-6 py-2">
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
    </div>

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
              {{ toggleLikeUnlike }}
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
    },
    toggleLikeUnlike() {
      return !this.liked ? "Like" : "Unlike";
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
        const res = await this.$store.dispatch("toggleLike", {
          liked: !this.liked,
          index: this.index,
          id: this.post._id
        });
        if (res.status === 200) {
          this.liked = !this.liked;
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss"></style>
