<template>
  <v-dialog scrollable v-model="dialog" max-width="400px">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot></slot>
      </span>
    </template>
    <v-card class="bg edit-profile">
      <v-card-title>
        <h1 class="title ms-2">Following</h1>
        <v-spacer></v-spacer>
        <div>{{ following }} User</div>
      </v-card-title>
      <v-card-text style="height: 80vh;">
        <h2 class="my-4" v-for="i in 50" :key="i">
          testing
        </h2>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    userName: { type: String, required: true },
    following: { required: true }
  },
  data: () => ({
    dialog: false
  }),
  computed: {
    getFollowing() {
      if (this.dialog === true) {
        console.log("getting users...");
        return "getting users...";
      } else return "bye";
    }
  },
  mounted() {
    console.log("edit post");
  }
};
</script>

<style>
.edit-profile .v-card__title {
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
