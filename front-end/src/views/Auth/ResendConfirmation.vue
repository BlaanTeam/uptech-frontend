<template>
  <v-container fluid class="pa-10">
    <v-col cols="8" offset="3">
      <h1 class="display-3 my-10">{{ $t("find") }}</h1>
      <v-form ref="resendConfirmation">
        <v-col cols="8">
          <h3 class="mb-6">{{ $t("enter") }}</h3>
          <v-text-field
            dense
            outlined
            rounded
            autofocus
            name="email"
            autocomplete="false"
            v-model="email"
            :rules="emailRules"
          ></v-text-field>
          <v-btn
            @click="handleSubmit()"
            class="py-4 mt-2 mr-1 px-4"
            rounded
            color="primary"
            dark
            elevation="0"
          >
            <!-- {{ $t("search") }} -->
            Send
          </v-btn>
        </v-col>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: "RenesendConfirmation",
  data() {
    return {
      email: ""
    };
  },
  computed: {
    emailRules() {
      return [
        v => !!v || this.$t("forms.email") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.email.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.email")
      ];
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.resendConfirmation.validate()) {
        let loader = this.$loading.show({ container: null, canCancel: false });
        this.$store
          .dispatch("resendConfirmation", {
            email: this.email
          })
          .then(res => {
            loader.hide();
            if (res.status === 200 && res.data.code === 2051) {
              this.$notify({
                group: "success",
                type: "success",
                title: "forgot password",
                text: res.data.msg
              });
            }
          })
          .catch(err => {
            loader.hide();
            if (err.response) {
              if (
                err.response.status === 404 &&
                err.response.data.error.code === 1030
              ) {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: "Forgot password Error",
                  text: err.response.data.error.msg
                });
              } else if (
                err.response.status === 429 &&
                err.response.data.error.code === 1032
              ) {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: "Forgot password Error",
                  text: err.response.data.error.msg
                });
              }
            }
          });
      }
    }
  }
};
</script>

<style></style>
