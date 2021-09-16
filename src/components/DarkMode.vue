<template>
  <v-btn text @click="darkModeToggle" height="0">
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  data: () => ({
    icon: "",
    darkMode: false
  }),

  methods: {
    enableDarkMode() {
      this.$vuetify.theme.dark = true;
      this.icon = "mdi-white-balance-sunny";
      localStorage.setItem("dark", "true");
    },
    disableDarkMode() {
      this.$vuetify.theme.dark = false;
      this.icon = "mdi-weather-night";
      localStorage.setItem("dark", "false");
    },
    darkModeToggle() {
      this.darkMode = localStorage.getItem("dark");
      if (this.darkMode !== "true") {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    }
  },
  mounted() {
    this.darkMode = localStorage.getItem("dark");
    if (this.darkMode === "true") {
      this.enableDarkMode();
    } else this.disableDarkMode();
  }
};
</script>
