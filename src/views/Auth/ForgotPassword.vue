<template>
  <v-container fluid class="pa-0">
    <v-card class="mx-auto bg mt-8 py-8" max-width="600">
      <h1 class="display-3 my-10 ms-4">{{ $t("forgotPassword.h1") }}</h1>
      <v-card-text>
        <h3 class="mb-3">{{ $t("forgotPassword.h2") }}</h3>
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
            {{ $t("forgotPassword.search") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ForgotPassword",
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
      this.$refs.forgotPassword.validate();
    }
  },
  methods: {
    successNotification(text) {
      this.$notify({
        group: "success",
        type: "success",
        title: this.$t("forgotPassword.success.name"),
        text: text
      });
    },
    errorNotification(text) {
      this.$notify({
        group: "errors",
        type: "error",
        title: this.$t("forgotPassword.errors.name"),
        text: text
      });
    },
    handleSubmit() {
      if (this.$refs.forgotPassword.validate()) {
        this.loading = true;
        this.$store
          .dispatch("forgotPassword", {
            email: this.email
          })
          .then(res => {
            this.loading = false;
            if (res.status === 200) {
              this.successNotification(
                this.$t("forgotPassword.success.msgSent")
              );
            }
          })
          .catch(({ response }) => {
            this.loading = false;
            if (response?.status === 404) {
              this.errorNotification(
                this.$t("forgotPassword.errors.invalidEmail")
              );
            } else if (response?.status === 429) {
              this.errorNotification(
                this.$t("forgotPassword.errors.tooManyReq")
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
