<template>
  <div class="home">
    <v-carousel v-model="model" style="height:100%">
      <v-carousel-item v-for="(color, i) in colors" :key="color">
        <v-sheet :color="color" height="100%" tile>
          <v-row class="fill-height" align="center" justify="center">
            <div class="display-3">Slide {{ i + 1 }}</div>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      model: 2,
      colors: ["primary", "secondary", "yellow darken-2", "red", "orange"]
    };
  }
};
</script>
