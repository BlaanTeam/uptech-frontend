<template>
  <v-btn text fab @click="darkModeToggle">
    <v-icon large>{{ icon }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  // Data =================================
  data: () => ({
    // light and dark mode
    icon: "",
    darkMode: null
  }),
  // Methods =====================================
  methods: {
    enableDarkMode() {
      // set vuetify theme dark to true
      this.$vuetify.theme.dark = true;
      this.icon = "mdi-weather-sunny";
      //  Update darkMode in localStorage
      localStorage.setItem("darkMode", "enabled");
    },

    disableDarkMode() {
      // set vuetify theme dark to false
      this.$vuetify.theme.dark = false;
      this.icon = "mdi-brightness-2";

      // 2. Update darkMode in localStorage
      localStorage.setItem("darkMode", null);
    },

    // toggle between dark and light mode
    darkModeToggle() {
      // get their darkMode setting
      this.darkMode = localStorage.getItem("darkMode");
      if (this.darkMode !== "enabled") {
        this.enableDarkMode();
      } else {
        this.disableDarkMode();
      }
    }
  },
  // vueJs mounted lifecycle hook
  mounted() {
    // check for saved 'darkMode' in localStorage
    this.darkMode = localStorage.getItem("darkMode");
    if (this.darkMode === "enabled") {
      this.enableDarkMode();
    } else this.disableDarkMode();
  }
};
</script>
