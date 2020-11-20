<template>
  <v-container fluid class="pa-10">
    <v-col cols="8" offset="3">
      <h1 class="display-3 my-10">{{ $t("reset") }}</h1>
      <v-form ref="resetPassword">
        <v-col cols="8">
          <h3 class="mb-6">{{ $t("enterPassword") }}</h3>
          <v-text-field
            prepend-icon="mdi-lock"
            class="mt-6"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="password"
            :label="$t('forms.password')"
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
            :label="$t('repeat') + ' ' + $t('forms.password')"
            @click:append="show2 = !show2"
            required
          ></v-text-field>
          <v-btn
            @click="handleSubmit()"
            class="py-4 mt-2 mr-1 px-4"
            rounded
            color="primary"
            dark
            elevation="0"
          >
            {{ $t("change") }}
          </v-btn>
        </v-col>
      </v-form>
    </v-col>
  </v-container>
</template>

<script>
export default {
  name: "ResetPassword",
  data() {
    return {
      show1: false,
      show2: false,
      password: "",
      repeatPassword: ""
    };
  },
  computed: {
    passwordRules() {
      return [
        v =>
          !!v || this.$t("forms.password") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.password.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.password")
      ];
    }
  },
  methods: {
    handleSubmit() {
      if (this.$refs.resetPassword.validate()) {
        let loader = this.$loading.show({ container: null, canCancel: false });
        this.$store
          .dispatch("resetPassword", {
            token: this.$route.params.token,
            password: this.password
          })
          .then(res => {
            loader.hide();
            if (res.status === 200 && res.data.code === 2029) {
              this.$notify({
                group: "success",
                type: "success",
                title: "reset password",
                text: res.data.msg
              });
              this.$router.push({ name: "SignIn" });
            }
          })
          .catch(err => {
            loader.hide();
            if (err.response) {
              this.$router.push({ name: "NotFound" });
            }
          });
      }
    }
  },
  created() {
    // debugger;
    if (
      this.$route.params.token &&
      this.$route.params.token.match(this.$pattern.jwtToken)
    ) {
      this.$http
        .post("/auth/reset_password?check=true", {
          token: this.$route.params.token,
          password: "Abcd123#@"
        })
        .then(null, err => {
          this.$router.push({ name: "NotFound" });
        });
    } else {
      this.$router.push({ name: "NotFound" });
    }
  }
};
</script>

<style></style>
