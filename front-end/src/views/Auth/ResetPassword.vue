<template>
  <v-container fluid class="pa-0">
    <v-card max-width="600" class="mt-10 mx-auto pb-10 bg px-4 py-4">
      <h1 class="display-3 my-10 ms-1">{{ $t("resetPassword.h1") }}</h1>
      <v-form ref="resetPassword" v-model="validity">
        <h3 class="mb-6">{{ $t("resetPassword.h2") }}</h3>
        <v-text-field
          prepend-icon="mdi-lock"
          class="mt-6"
          v-model="password"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show1 ? 'text' : 'password'"
          name="password"
          :label="$t('resetPassword.form.password')"
          :rules="passwordRules"
          required
          @click:append="show1 = !show1"
        ></v-text-field>
        <v-text-field
          prepend-icon="mdi-lock"
          class="my-6"
          :error="repeatPassword !== password"
          v-model="repeatPassword"
          :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show2 ? 'text' : 'password'"
          name="password"
          :label="$t('resetPassword.form.repeatPassword')"
          @click:append="show2 = !show2"
          required
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
          {{ $t("resetPassword.change") }}
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "ResetPassword",
  data() {
    return {
      userInfo: {},
      show1: false,
      show2: false,
      password: "",
      repeatPassword: "",
      loading: false,
      validity: false
    };
  },
  computed: {
    passwordRules() {
      return [
        v => !!v || this.$t("resetPassword.errors.prequired"),
        v =>
          this.$pattern.password.test(v) ||
          this.$t("resetPassword.errors.invalidp")
      ];
    }
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      this.$refs.resetPassword.validate();
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.resetPassword.validate()) {
        this.loading = true;
        this.$store
          .dispatch("resetPassword", {
            token: this.$route.params.token,
            userId: this.$route.params.userId,
            password: this.password
          })
          .then(res => {
            this.loading = false;
            if (res.status === 200 && res.data.code === 2029) {
              this.$notify({
                group: "success",
                type: "success",
                title: this.$t("resetPassword.success.name"),
                text: this.$t("resetPassword.success.passwordReset")
              });
              this.$router.push({ name: "SignIn" });
            }
          })
          .catch(err => {
            this.loading = false;
            if (err.response) {
              this.$router.push({ name: "NotFound" });
            }
          });
      }
    }
  },
  created() {
    if (
      this.$route.params.token?.match(this.$pattern.jwtToken) &&
      this.$route.params.userId?.match(this.$pattern.objectId)
    ) {
      this.$http
        .get(
          `/auth/reset-password/${this.$route.params.userId}/${this.$route.params.token}`
        )
        .then(
          resp => {
            this.userInfo = resp.data;
          },
          err => {
            this.$router.push({ name: "NotFound" });
          }
        );
    } else {
      this.$router.push({ name: "NotFound" });
    }
  }
};
</script>

<style></style>
