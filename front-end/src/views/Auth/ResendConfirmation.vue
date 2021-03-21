<template>
  <v-container fluid class="pa-0">
    <v-card class="mx-auto bg py-6 mt-8" max-width="600">
      <h1 class="display-3 my-10 my-10 ms-4">
        {{ $t("resendConfirmation.h1") }}
      </h1>
      <v-card-text>
        <h3 class="mb-6">{{ $t("resendConfirmation.h2") }}</h3>
        <v-form ref="forgotPassword" v-model="validity">
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
            :loading="loading"
            :disabled="loading || !validity"
            type="submit"
            elevation="0"
          >
            {{ $t("resendConfirmation.send") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "RenesendConfirmation",
  data() {
    return {
      email: "",
      loading: false,
      validity: false
    };
  },
  computed: {
    emailRules() {
      return [
        v => !!v || this.$t("signup.errors.erequired"),
        v => this.$pattern.email.test(v) || this.$t("signup.errors.invalide")
      ];
    }
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      this.$refs.resendConfirmation.validate();
    }
  },
  methods: {
    successNotification(text) {
      this.$notify({
        group: "success",
        type: "success",
        title: this.$t("resendConfirmation.success.name"),
        text: text
      });
    },
    errorNotification(text, type = "error") {
      this.$notify({
        group: "errors",
        type: type,
        title: this.$t("resendConfirmation.errors.name"),
        text: this.$t("signup.errors.usernameAlreadyRegistred")
      });
    },
    handleSubmit() {
      if (this.$refs.resendConfirmation.validate()) {
        this.loading = true;
        this.$store
          .dispatch("resendConfirmation", {
            email: this.email
          })
          .then(res => {
            this.loading = false;
            if (res.status === 200 && res.data.code === 2051) {
              this.successNotification(
                this.$t("resendConfirmation.success.msgSent")
              );
            }
          })
          .catch(({ response }) => {
            this.loading = false;
            if (
              response?.status === 404 &&
              response?.data?.error?.code === 1030
            ) {
              this.errorNotification(
                this.$t("resendConfirmation.errors.invalidEmail")
              );
            } else if (
              response?.status === 429 &&
              response?.data?.error?.code === 1032
            ) {
              this.errorNotification(
                this.$t("resendConfirmation.errors.tooManyReq")
              );
            }
          });
      }
    }
  }
};
</script>

<style scoped>
.v-text-field {
  max-width: 420px;
}
</style>
