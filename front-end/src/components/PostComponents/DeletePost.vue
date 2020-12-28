<template>
  <div class="post-delete text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <v-card class="d-flex flex-column justify-center align-center pa-10">
        <v-card-title>
          <h1 class="subtitle-1">
            You are going to delete this post are you sure ?
          </h1>
        </v-card-title>
        <v-card-actions>
          <v-btn
            @click="deletePost(post._id, index)"
            elevation="0"
            color="red"
            class="mr-10"
          >
            Delete
          </v-btn>
          <v-btn
            elevation="0"
            class="ml-10"
            @click="dialog = false"
            color="info"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
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
  data: () => ({
    dialog: false
  }),
  methods: {
    deletePost(id, index) {
      this.dialog = false;

      let el = document.querySelector("#card" + index);
      el.setAttribute("data-delete", "true");
      el.style.transition = "all 0.4s ease-in-out";

      setTimeout(() => {
        this.$store
          .dispatch("deletePost", {
            id: id,
            index: index
          })
          .then(() => {
            el.style.transition = null;
            el.removeAttribute("data-delete");
          })
          .catch(err => console.log(err));
      }, 400);
    }
  }
};
</script>

<style>
.v-card[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
</style>
