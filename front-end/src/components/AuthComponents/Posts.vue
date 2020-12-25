<template>
  <div>
    <v-card
      v-for="i in [1, 2, 3, 4]"
      :key="i"
      width="700"
      class="mx-auto secondarybg mb-2"
    >
      <v-card-title class="ma-0">
        <router-link to="profile/5543541">
          <v-avatar width="40" color="red">
            <span class="white--text headline">av</span>
          </v-avatar>
        </router-link>

        <div class="ms-4 post__info">
          <router-link to="profile/5543541">
            <h3 class="pa-0 ma-0">Dave doe</h3>
          </router-link>
          <h4 class="caption pa-0 ma-0"><timeago :datetime="1608866829878" :auto-update="60" /></h4>
        </div>
        <v-spacer></v-spacer>
        <v-menu offset-y left transition="slide-y-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              class="options secondarybg"
              elevation="0"
            >
              <v-icon size="40">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list class="text-center">
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>

      <router-link to="/post/36545471">
        <v-card-text class="px-6 mt-0 pt-0">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae
          explicabo provident magnam consequuntur in quidem ducimus aut fuga
          saepe tempora dolor aspernatur, vel veniam, tenetur porro facere
          maiores quisquam repudiandae? Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. Minus eaque nam cupiditate aliquam accusamus
          pariatur voluptates corrupti culpa sunt, tempora a laudantium non
          praesentium porro quisquam maxime earum autem ratione.
        </v-card-text>
      </router-link>

      <v-divider></v-divider>
      <v-card-actions class="px-4">
        <div class="ml-2">
          22
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
        </div>
        <div class="ml-10">
          10
          <v-btn icon>
            <v-icon>mdi-comment</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { title: "Edit" },
      { title: "Copy link" },
      { title: "Save" },
      { title: "Delete" }
    ]
  })
};
</script>

<style>
.feeds {
  width: 720px;
  margin: 20px 10px 60px 30px;
}
</style>
