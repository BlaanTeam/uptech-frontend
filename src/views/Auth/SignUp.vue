<template>
  <v-container fluid class="sign-up d-flex">
    <SignupWaveSvg
      :fillColor="$theme.currentTheme.secondarybg"
      class="background"
    />
    <v-row no-gutters class="sign-up__form app-width">
      <v-col class="d-none d-md-flex">
        <SignupSvg width="400" />
      </v-col>
      <v-col class="px-md-8 px-sm-1 mt-14">
        <v-form ref="signup" v-model="validity">
          <v-text-field
            append-icon="mdi-account"
            :counter="16"
            name="username"
            autocomplete="off"
            required
            v-model="username"
            :label="$t('signup.form.username')"
            :rules="usernameRules"
          />

          <v-text-field
            append-icon="mdi-email"
            class="mt-6"
            v-model="email"
            :rules="emailRules"
            :label="$t('signup.form.email')"
            required
            type="email"
            name="email"
          />
          <v-text-field
            class="mt-6 mb-6"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            name="password"
            :label="$t('signup.form.password')"
            :rules="passwordRules"
            required
            @click:append="show1 = !show1"
          />
          <v-checkbox
            v-model="agree"
            name="agreement"
            :rules="[v => !!v || $t('signup.errors.agree')]"
            required
          >
            <template v-slot:label>
              <div @click.stop="">
                {{ $t("signup.form.agree") }}
                <router-link to="/terms" class="primary--text underlined">
                  {{ $t("signup.form.terms") }}
                </router-link>
                {{ $t("signup.form.and") }}
                <router-link to="/conditions" class="primary--text underlined">
                  {{ $t("signup.form.conditions") }}
                </router-link>
              </div>
            </template>
          </v-checkbox>

          <v-btn
            @click="handleSubmit"
            color="primary"
            class="my-4 px-10"
            elevation="0"
            rounded
            type="submit"
            :loading="loading"
            :disabled="loading || !validity"
          >
            {{ $t("signup.name") }}
          </v-btn>
          <router-link
            to="/sign_in"
            class="ml-4 d-inline-flex primary--text"
            text
          >
            {{ $t("signup.form.alreadySigned") }}
          </router-link>
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
    // repeatPassword: "",
    agree: false,
    validity: false,
    loading: false
  }),
  computed: {
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
    successNotification(text) {
      this.$notify({
        group: "success",
        type: "success",
        title: this.$t("signup.success.auth"),
        text: text
      });
    },
    errorNotification(text, type = "error") {
      this.$notify({
        group: "errors",
        type: type,
        title: this.$t("signup.errors.auth"),
        text: text
      });
    },
    async handleSubmit() {
      if (!this.valid) return;
      this.loading = true;
      try {
        await this.$store.dispatch("signUp", {
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$router.push({ name: "SignIn" });
        this.successNotification(this.$t("signup.success.registred"));
      } catch ({ response }) {
        if (response?.status === 409) {
          this.errorNotification(
            this.$t("signup.errors.usernameAlreadyRegistred")
          );
        }
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss">
.sign-up {
  position: relative;
  height: 100vh;
  padding-top: 4vh !important;
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
.theme--light .sign-up {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
  }
}
.theme--dark .sign-up {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #1f2023 inset !important;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
  }
}
</style>
