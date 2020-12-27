<template>
  <div class="posts">
    <v-card
      v-for="(post, index) in posts"
      :key="index"
      class="mb-2 secondarybg"
    >
      <v-card-title class="ma-0">
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
              <h3 class="pa-0 ma-0">John doe</h3>
            </PopoverProfile>
          </router-link>
          <h4 class="caption pa-0 ma-0">
            <timeago :datetime="post.createdAt" :auto-update="60" />
          </h4>
        </div>
        <v-spacer></v-spacer>
        <v-menu nudge-right="25" offset-y left transition="slide-y-transition">
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
          <v-list class="text-center">
            <v-list-item>
              <v-list-item-title>Copy link</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Save</v-list-item-title>
            </v-list-item>

            <PostEdit :post="post" :index="index" />
            <v-list-item>
              <v-list-item-title
                @click="deletePost(post._id, index)"
                class="red--text"
              >
                Delete
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>

      <v-card-text
        v-html="postText(post.postBody, post._id)"
        class="body-2 px-6 mt-0 pt-0"
      >
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions class="px-4">
        <div class="ml-2">
          22
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </div>
        <div class="ml-10">
          {{ post.totalComments }}
          <v-btn @click="commentExpand(post)" icon>
            <v-icon>mdi-comment</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="post.commentExpand" class="my-1">
          <div class="d-inline-block float-left ms-2">
            <v-avatar width="20" color="green" class="mt-3">
              <span class="white--text headline">me</span>
            </v-avatar>
          </div>
          <div class="d-block mx-4 ms-14 px-4 py-1">
            <v-textarea
              autofocus
              placeholder="What you do think"
              label=""
              auto-grow
              rows="1"
              row-height="10"
              v-model="post.comment"
              @keypress.enter="addComment(post, index)"
            ></v-textarea>
          </div>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import PostEdit from "./PostEdit";
import PopoverProfile from "./PopoverProfile";

export default {
  components: {
    PostEdit,
    PopoverProfile
  },
  props: {
    posts: {
      type: Array,
      required: true
    }
  },
  data: () => ({}),
  methods: {
    postText(text, id) {
      if (text.length > 600)
        return (
          text.slice(0, 600) +
          `...&nbsp<a id="read-more" href="#/post/${id}">read&nbspmore</a>`
        );
      return text;
    },
    commentExpand(post) {
      if (post.commentExpand === undefined)
        this.$set(post, "commentExpand", true);
      else post.commentExpand = !post.commentExpand;
    },
    async addComment(post, index) {
      try {
        const res = await this.$store.dispatch("addComment", {
          comment: post.comment,
          index: index,
          id: post._id
        });
        post.comment = "";
      } catch (err) {
        console.log(err);
      }
    },
    async deletePost(id, index) {
      try {
        const res = await this.$store.dispatch("deletePost", {
          id: id,
          index: index
        });
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss">
.posts {
  position: relative;
  .theme--light {
    #read-more {
      color: #240497 !important;
    }
  }
  .theme--dark {
    #read-more {
      color: #f5b01b !important;
    }
  }
}
</style>
