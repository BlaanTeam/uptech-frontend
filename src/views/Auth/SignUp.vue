<template>
  <v-container fluid class="sign-up d-flex">
    <SignupWaveSvg
      :fillColor="$theme.currentTheme.secondarybg"
      class="background"
    />
    <v-row no-gutters class="sign-up__form align-center">
      <v-col class="d-none d-md-flex">
        <SignupSvg width="400" />
      </v-col>
      <v-col class="px-2 align-self-start mt-4">
        <v-form ref="signup" v-model="validity">
          <v-text-field
            prepend-icon="mdi-account"
            class="my-6"
            :counter="16"
            name="username"
            autocomplete="off"
            required
            v-model="username"
            :label="$t('signup.form.username')"
            :rules="usernameRules"
          ></v-text-field>

          <v-text-field
            prepend-icon="mdi-email"
            class="my-6"
            v-model="email"
            :rules="emailRules"
            :label="$t('signup.form.email')"
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
            :label="$t('signup.form.password')"
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
            :label="$t('signup.form.repeatPassword')"
            @click:append="show2 = !show2"
            required
          ></v-text-field>

          <v-checkbox
            class="ml-2"
            v-model="agree"
            name="agreement"
            :rules="[v => !!v || $t('signup.errors.agree')]"
            required
          >
            <template v-slot:label>
              <div @click.stop="">
                {{ $t("signup.form.agree") }}
                <router-link to="/terms">
                  {{ $t("signup.form.terms") }}
                </router-link>
                {{ $t("signup.form.and") }}
                <router-link to="/conditions">
                  {{ $t("signup.form.conditions") }}
                </router-link>
              </div>
            </template>
          </v-checkbox>

          <v-btn
            @click="handleSubmit"
            color="primary"
            class="ml-2 my-4 px-10"
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
    repeatPassword: "",
    agree: false,
    validity: false,
    loading: false
  }),
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
    handleSubmit() {
      if (this.valid) {
        this.loading = true;
        this.$store
          .dispatch("signUp", {
            username: this.username,
            email: this.email,
            password: this.password
          })
          .then(res => {
            this.loading = false;
            if (res.status === 201) {
              this.$router.push({ name: "SignIn" });
              this.successNotification(this.$t("signup.success.registred"));
            }
          })
          .catch(({ response }) => {
            this.loading = false;
            if (response?.status === 409) {
              this.errorNotification(
                this.$t("signup.errors.usernameAlreadyRegistred")
              );
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
