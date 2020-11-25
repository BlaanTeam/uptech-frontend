<template>
  <v-container fluid class="sign-up d-flex">
    <SignupWaveSvg
      :fillColor="$theme.currentTheme.secondarybg"
      class="background"
    />
    <v-row no-gutters class="sign-up__form align-center">
      <v-col class="d-none d-sm-flex">
        <SignupSvg width="400" />
      </v-col>
      <v-col class="px-10 align-self-start mt-10">
        <v-form ref="signup">
          <v-text-field
            prepend-icon="mdi-account"
            class="my-6"
            :counter="16"
            name="username"
            autocomplete="off"
            required
            v-model="username"
            :label="$t('forms.username')"
            :rules="usernameRules"
          ></v-text-field>
          <v-text-field
            prepend-icon="mdi-email"
            class="my-6"
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            required
            type="email"
            name="email"
          ></v-text-field>
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
            :label="$t('repeat') + $t('forms.password')"
            @click:append="show2 = !show2"
            required
          ></v-text-field>

          <v-checkbox
            class="ml-2"
            v-model="agree"
            name="agreement"
            :rules="[v => !!v || $t('forms.errors.agree')]"
            required
          >
            <template v-slot:label>
              <div @click.stop="">
                {{ $t("forms.agree") }}
                <router-link to="/terms">{{ $t("forms.terms") }}</router-link>
                {{ $t("and") }}
                <router-link to="/conditions"
                  >{{ $t("forms.conditions") }} ?
                </router-link>
              </div>
            </template>
          </v-checkbox>

          <v-btn
            @click="handleSubmit"
            color="primary"
            dark
            class="ml-2 mt-6 px-10"
            elevation="0"
            rounded
            :disabled="disabled"
          >
            {{ $t("btn.signup") }}
          </v-btn>
          <v-btn to="sign_in" class="ml-6 mt-6 primary--text" text>
            {{ $t("forms.already") }} ?
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SignupWaveSvg from "@/components/svg/SignupWaveSvg";
import SignupSvg from "@/components/svg/SignupSvg";

export default {
  components: {
    SignupWaveSvg,
    SignupSvg
  },
  data: () => ({
    show1: false,
    show2: false,
    disabled: false,
    // models
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    agree: false
  }),
  computed: {
    usernameRules() {
      return [
        v =>
          !!v || this.$t("forms.username") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.username.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.username")
      ];
    },
    emailRules() {
      return [
        v => !!v || this.$t("forms.email") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.email.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.email")
      ];
    },
    passwordRules() {
      return [
        v =>
          !!v || this.$t("forms.password") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.password.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.password")
      ];
    },
    valid() {
      return this.$refs.signup.validate();
    }
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      this.$refs.signup.validate();
    }
  },

  methods: {
    handleSubmit() {
      if (this.valid) {
        let loader = this.$loading.show({ container: null, canCancel: false });
        this.$store
          .dispatch("signUp", {
            username: this.username,
            email: this.email,
            password: this.password
          })
          .then(res => {
            loader.hide();
            if (res.status === 201 && res.data.code === 2062) {
              this.$router.push({ name: "SignIn" });
              this.$notify({
                group: "success",
                type: "success",
                title: "Authentication Success",
                text:
                  "Regitered successfully ! check your email to confirm your account"
              });
            }
          })
          .catch(err => {
            this.password = "";
            this.repeatPassword = "";
            loader.hide();
            if (
              err.response.status === 409 &&
              err.response.data.error.code === 1092
            ) {
              this.$notify({
                group: "errors",
                type: "error",
                title: "Authentication Error",
                text: err.response.data.error.msg
              });
            }
          });
      }
    }
  }
};
</script>
<style lang="scss">
.sign-up {
  position: relative;
  height: 100%;
  z-index: 1;
  .background {
    position: absolute;
    z-index: -1;
    width: 100vw;
    bottom: 0px;
    left: 0;
  }
  &__form {
    max-width: 90vw;
    margin: 0 auto;
  }
}
</style>
