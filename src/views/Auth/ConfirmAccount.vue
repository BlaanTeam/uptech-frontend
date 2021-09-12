<template>
  <div></div>
</template>

<script>
export default {
  name: "ConfirmAccount",
  computed: {
    isValidToken() {
      return (
        !!this.$route.params.token &&
        this.$route.params.token.match(this.$pattern.jwtToken)
      );
    },
    getToken() {
      return this.$route.params.token;
    }
  },
  methods: {
    successNotification(text) {
      this.$notify({
        group: "success",
        type: "success",
        title: this.$t("confirmAccount.success.name"),
        text: text
      });
    },
    errorNotification(text, type = "error") {
      this.$notify({
        group: "errors",
        type: "error",
        title: this.$t("confirmAccount.errors.name"),
        text: text
      });
    }
  },
  created() {
    if (this.isValidToken) {
      this.$store
        .dispatch("confirmAccount", {
          token: this.getToken
        })
        .then(res => {
          if (res.status === 200) {
            this.$router.push({ name: "SignIn" });
            this.successNotification(
              this.$t("confirmAccount.success.confirmed")
            );
          }
        })
        .catch(({ response }) => {
          this.$router.push({ name: "SignIn" });
          if (response?.status === 401) {
            this.errorNotification(
              this.$t("confirmAccount.errors.invOrExp"),
              "warn"
            );
          } else {
            this.errorNotification(this.$t("confirmAccount.errors.invOrExp"));
          }
        });
    } else {
      this.errorNotification(this.$t("confirmAccount.errors.invOrExp"));
    }
  }
};
</script>

<style></style>
