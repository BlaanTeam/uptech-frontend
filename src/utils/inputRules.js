import Vue from "vue";

Vue.mixin({
  computed: {
    usernameRules() {
      return [
        v => !!v || this.$t("signup.errors.urequired"),
        v => this.$pattern.username.test(v) || this.$t("signup.errors.invalidu")
      ];
    },
    emailRules() {
      return [
        v => !!v || this.$t("signup.errors.erequired"),
        v => this.$pattern.email.test(v) || this.$t("signup.errors.invalide")
      ];
    },
    passwordRules() {
      return [
        v => !!v || this.$t("signup.errors.prequired"),
        v => this.$pattern.password.test(v) || this.$t("signup.errors.invalidp")
      ];
    }
  }
});
