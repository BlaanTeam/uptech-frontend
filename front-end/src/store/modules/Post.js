import Vue from "vue";

export default {
  state: {
    posts: []
  },
  getters: {
    getPosts: state => state.posts
  },
  mutations: {
    INIT_POSTS(state, payload) {
      state.posts = payload;
    },
    ADD_POST(state, payload) {
      state.posts.unshift(payload);
    },
    EDIT_POST(state, payload) {
      state.posts[payload.index] = payload.data;
    },
    DELETE_POST(state, payload) {
      state.posts.splice(payload.index, 1);
    },
    INCREASE_COMMENT_SIZE(state, payload) {
      state.posts[payload.index].totalComments++;
    }
  },
  actions: {
    getFeedPosts(context) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .get("/feed/posts")
          .then(res => {
            if (res.status === 200) {
              context.commit("INIT_POSTS", res.data);
              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    },
    createPost(context, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/feed/posts", {
            postBody: payload.postBody,
            isPrivate: payload.isPrivate
          })
          .then(res => {
            if (res.status === 201) {
              context.commit("ADD_POST", res.data);
              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    },
    editPost(context, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .put(`/feed/posts/${payload.id}`, {
            postBody: payload.postBody,
            isPrivate: payload.isPrivate
          })
          .then(res => {
            if (res.status === 201) {
              context.commit("EDIT_POST", {
                index: payload.index,
                data: res.data
              });
              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    },
    deletePost(context, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .delete(`/feed/posts/${payload.id}`)
          .then(res => {
            if (res.status === 204) {
              context.commit("DELETE_POST", {
                index: payload.index
              });

              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    },
    addComment(context, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post(`/feed/posts/${payload.id}/comments`, {
            commentBody: payload.comment
          })
          .then(res => {
            if (res.status === 200) {
              context.commit("INCREASE_COMMENT_SIZE", {
                index: payload.index
              });

              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    }
  }
};
