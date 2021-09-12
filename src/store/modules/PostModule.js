import Vue from "vue";

export default {
  state: {
    posts: [],
    createdAt: null
  },
  getters: {
    getPosts: state => state.posts
  },
  mutations: {
    DESTROY_POSTS(state) {
      state.posts.length = 0;
    },
    INIT_POSTS(state, payload) {
      state.posts.push(...payload);
    },
    EDIT_POST(state, payload) {
      state.posts[payload.index] = payload;
    },
    DELETE_POST(state, payload) {
      let el = document.querySelector("#card" + payload.id);
      el.setAttribute("data-delete", "true");
      el.style.transition = "all 0.5s ease-in-out";
      setTimeout(() => {
        el.remove();
        if (state.posts.length) state.posts.splice(payload.index, 1);
      }, 500);
    }
  },
  actions: {
    destroyPosts(context) {
      context.commit("DESTROY_POSTS");
    },
    getFeedPosts(context) {
      return new Promise((resolve, reject) => {
        let path = "/feed/posts";
        if (context.state.createdAt)
          path += `?createdAt=${context.state.createdAt}`;
        Vue.prototype.$http
          .get(path)
          .then(res => {
            if (res.status === 200) {
              let lastPost = res.data.posts[res.data.posts.length - 1];
              context.state.createdAt = lastPost.createdAt;
              context.commit("INIT_POSTS", res.data.posts);
              resolve(res.data.posts);
            }
          })
          .catch(err => reject(err));
      });
    },
    createPost(context, payload) {
      return new Promise((resolve, reject) => {
        Vue.prototype.$http
          .post("/feed/posts", {
            content: payload.content,
            isPrivate: payload.isPrivate
          })
          .then(res => {
            if (res.status === 201) {
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
            content: payload.content,
            isPrivate: payload.isPrivate
          })
          .then(res => {
            if (res.status === 200) {
              context.commit("EDIT_POST", {
                data: { ...res.data, ...payload }
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
              context.commit("DELETE_POST", payload);

              resolve(res);
            }
          })
          .catch(err => reject(err));
      });
    }
  }
};
