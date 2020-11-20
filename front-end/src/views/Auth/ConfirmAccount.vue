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
  created() {
    if (this.isValidToken) {
      this.$store
        .dispatch("confirmAccount", {
          token: this.getToken
        })
        .then(res => {
          //Todo: change data
          if (res.status === 200 && res.data.confirmed)
            this.$router.push({ name: "SignIn" });
          this.$notify({
            group: "success",
            type: "success",
            title: "succeed",
            text: "Confirmed successfully"
          });
        })
        .catch(err => {
          this.$router.push({ name: "SignIn" });
          if (err.response) {
            if (
              err.response.status === 401 &&
              err.response.data.error.code === 1026
            ) {
              this.$notify({
                group: "errors",
                type: "warn",
                title: "Account Error",
                text: "this account already confirmed"
              });
            } else {
              //1026
              this.$notify({
                group: "errors",
                type: "error",
                title: "Token Error",
                text: "Invalid or expired token"
              });
            }
          }
        });
    } else {
      this.$notify({
        group: "errors",
        type: "error",
        title: "Token Error",
        text: "Invalid or expired token"
      });
    }
  }
};
</script>

<style></style>
