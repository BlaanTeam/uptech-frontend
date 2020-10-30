<template>
  <Layout>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
        <v-snackbar v-model="snackbar">
          {{ text }}

          <template v-slot:action="{ attrs }">
            <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </Layout>
</template>

<script>
export default {
  name: "App",
  created() {
    this.snackbar = true;
  },
  data() {
    return {
      snackbar: false,
      text: "Welcome To UpTech"
    };
  }
};
</script>
<style lang="scss"></style>
