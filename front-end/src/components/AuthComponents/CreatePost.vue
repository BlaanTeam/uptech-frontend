<template>
  <v-card width="700" class="mx-auto secondarybg my-10">
    <v-card-title class="ma-0">
      <v-avatar width="40" color="green">
        <span class="white--text headline">me</span>
      </v-avatar>
      <div class="ms-4 post__text-area">
        <v-textarea
          placeholder="What's on your mind"
          label=""
          auto-grow
          rows="1"
          row-height="10"
          counter="5000"
        ></v-textarea>
      </div>
    </v-card-title>
    <v-card-actions class="px-4">
      <v-menu class="mr-auto bg" offset-y left transition="slide-y-transition">
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on" elevation="0">
            <v-icon size="20" left>mdi-earth</v-icon>
            Public
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list class="text-center">
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn class="ms-auto primary" elevation="0">
        Post
        <v-icon right>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    items: [{ title: "Private" }, { title: "Friends" }]
  })
};
</script>

<style>
.post__text-area {
  width: 70%;
}
</style>
