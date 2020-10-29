<template>
  <Layout>
    <v-main> </v-main>
  </Layout>
</template>

<script>
export default {
  name: "App",
  created() {
    this.$http
      .get("/")
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="scss"></style>
