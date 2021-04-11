<template>
  <v-menu offset-y nudge-left="25" transition="slide-y-transition">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" text icon>
        <v-icon size="40">mdi-dots-horizontal</v-icon>
      </v-btn>
    </template>
    <div class="bg d-flex flex-column align-start">
      <v-btn tile block text class="text-capitalize justify-start">
        <v-icon small left>mdi-square-edit-outline</v-icon>
        Edit
      </v-btn>
      <v-btn color="red" tile block text class="text-capitalize justify-start">
        <v-icon small left>mdi-delete</v-icon>
        Delete
      </v-btn>
    </div>
  </v-menu>
</template>

<script>
export default {
  name: "MessageMenu",
  props: {
    message: { type: Object, required: true }
  },
  methods: {
    editMessage() {},
    deleteMessage() {}
  }
};
</script>

<style></style>
