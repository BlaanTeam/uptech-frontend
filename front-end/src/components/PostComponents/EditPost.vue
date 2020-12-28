<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500" persistent>
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>
      <v-card class="d-flex flex-column justify-center align-center py-4">
        <v-card-title>
          Post editing
        </v-card-title>

        <v-card-text class="py-0 my-0">
          <v-textarea
            rows="10"
            no-resize
            filled
            v-model="postBody"
          ></v-textarea>
        </v-card-text>

        <v-card-actions class="py-0 my-0">
          <v-row>
            <v-col class="me-10">
              <v-btn
                class="px-6"
                elevation="0"
                dark
                color="primary"
                @click="editPost"
              >
                Save
              </v-btn>
            </v-col>
            <v-col class="ms-10">
              <v-btn elevation="0" dark color="bg" @click="dialog = false">
                cancel
              </v-btn>
            </v-col>
          </v-row>
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
  data: props => ({
    dialog: false,
    postBody: props.post.postBody
  }),
  methods: {
    async editPost() {
      if (this.postBody.trim() === "" || this.postBody.length < 2) return;
      this.dialog = false;
      try {
        const res = await this.$store.dispatch("editPost", {
          postBody: this.postBody,
          isPrivate: this.post.isPrivate,
          id: this.post._id,
          index: this.index
        });
        this.post.postBody = this.postBody;
        console.log("Post Edited successfully");
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
