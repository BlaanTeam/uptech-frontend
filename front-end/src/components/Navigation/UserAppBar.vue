<template>
  <v-app-bar app height="50%" bg>
    <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
    <v-toolbar-title>UpTech</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-frequently-asked-questions</v-icon>
        </v-btn>
      </template>
      <span>Frequently Qsked Questions</span>
    </v-tooltip>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppBar"
};
</script>
<style scoped>
.theme--light.v-app-bar.v-toolbar.v-sheet {
  background-color: #fff;
}
</style>
