import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        bg: "#ffffff",
        secondarybg: "#dfdddd",
        primary: "#f0a709",
        secondary: "#b0bec5",
        accent: "#8c9eff",
        error: "#f00909"
      },
      dark: {
        // bg: "#2F3136", // discord style
        // bg: "#050f24", // oumoussa style
        bg: "#1F2023", // linear.app style
        // bg: "#111233", // geeksblabla style
        // bg: "#15202B", // twitter style

        // secondarybg: "#36393F", // discord style
        // secondarybg: "#040c1d", // oumoussa style
        secondarybg: "#27282B", // linear.app style
        // secondarybg: "#1D1E4F", // geeksblabla style
        // secondarybg: "#202E3A", // twitter style

        primary: "#f0a709",
        secondary: "#b0bec5",
        accent: "#8c9eff",
        error: "#ff6767"
      }
    }
  }
});
