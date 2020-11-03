<template>
  <v-container class="guest my-10 py-10 d-flex">
    <v-row class="align-center">
      <v-col cols="5" offset="1" class="mt-4">
        <img
          src="@/assets/images/guest.svg"
          alt="Guest illustration"
          width="350"
        />
      </v-col>
      <v-col cols="5">
        <h1 class="display-2 py-2">Login as guest</h1>
        <p class="display-1">
          Once you logged in as guest you can browse all of the public content
          on our servers without providing any personal informations
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
<style lang="scss">
.guest {
  min-height: 85vh;
}
</style>
