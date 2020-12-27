<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item v-bind="attrs" v-on="on">
          <v-list-item-title>Edit</v-list-item-title>
        </v-list-item>
      </template>
      <v-card>
        <v-card-title class="">
          Post editing
        </v-card-title>

        <v-card-text>
          <v-textarea
            rows="10"
            no-resize
            filled
            v-model="post.postBody"
            @keypress.enter="editPost"
          ></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
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
    async editPost() {
      try {
        let res = await this.$store.dispatch("editPost", {
          postBody: this.post.postBody,
          isPrivate: this.post.isPrivate,
          id: this.post._id,
          index: this.index
        });
        if (res.status === 200) {
          // TODO: notify user
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
