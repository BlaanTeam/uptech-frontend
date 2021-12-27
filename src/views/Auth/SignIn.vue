<template>
  <v-container fluid fill-height class="sign-in">
    <div class="sign-in__background">
      <WaveSvg :fillColor="$theme.currentTheme.secondarybg" />
    </div>
    <v-card class="mx-auto my-0 bg lighten-1 app-width" width="550">
      <div class="text-center">
        <span class="d-inline-block rounded-xl mt-1 primary">
          <v-icon size="37">
            mdi-account-circle
          </v-icon>
        </span>
      </div>

      <v-card-title class="pt-0 mb-2 display-1 justify-center">
        {{ $t("signin.h1") }}
      </v-card-title>
      <v-card-subtitle class="text-center">
        <v-btn
          class="me-2 py-1 text-none my-1"
          color="secondarybg"
          rounded
          elevation="0"
          @click="generateGuest"
          :loading="generateLoading"
        >
          <v-icon left>mdi-account-arrow-up-outline</v-icon>
          Generate a random user
        </v-btn>
      </v-card-subtitle>
      <v-card-text class="pa-0 ma-0">
        <v-form ref="signin" v-model="validity" @submit.prevent="login()">
          <div class="pa-4">
            <v-text-field
              name="username"
              autocomplete="false"
              v-model="username"
              :label="$t('signin.form.username')"
              :rules="usernameRules"
              append-icon="mdi-account-outline"
            />
            <v-text-field
              class="mt-4"
              v-model="password"
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              name="password"
              :label="$t('signin.form.password')"
              :rules="passwordRules"
              @click:append="show = !show"
            />
            <v-checkbox
              name="rememberMe"
              v-model="rememberMe"
              :label="$t('signin.form.rememberMe')"
            />
            <v-row no-gutters>
              <router-link
                class="mb-1 d-inline primary--text"
                to="forgot_password"
              >
                {{ $t("signin.form.forgotPassword") }}
              </router-link>
            </v-row>
            <v-row no-gutters>
              <router-link class="primary--text" block to="resend_confirmation">
                {{ $t("signin.form.resendConfirmation") }}
              </router-link>
            </v-row>
          </div>
          <v-btn
            block
            class="py-6"
            color="primary"
            :dark="!loading"
            type="submit"
            :loading="loading"
            :disabled="loading || !validity"
          >
            {{ $t("signin.name") }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import WaveSvg from "@/components/svg/WaveSvg";

export default {
  components: {
    WaveSvg
  },
  data() {
    return {
      show: false,
      // models
      username: "",
      password: "",
      rememberMe: false,
      validity: false,
      loading: false,
      generateLoading: false
    };
  },
  computed: {
    valid() {
      return this.$refs.signin.validate();
    }
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      this.$refs.signin.validate();
    }
  },
  methods: {
    errorNotification(text, type = "error") {
      this.$notify({
        group: "errors",
        type: type,
        title: this.$t("signin.errors.auth"),
        text: text
      });
    },
    async login() {
      if (!this.valid) return;
      this.loading = true;
      try {
        await this.$store.dispatch("signIn", {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        });
        if (this.$route.query.nextPath) {
          await this.$router.push({
            name: this.$route.query.nextPath,
            params: this.$route.params
          });
        } else await this.$router.push({ name: "Feeds" });
      } catch ({ response }) {
        if (response?.status === 401 && response?.data.error.notConfirmed)
          this.errorNotification(this.$t("signin.errors.notConfirmed"), "warn");
        else if (response?.status === 401)
          this.errorNotification(this.$t("signin.errors.invalid"));
      } finally {
        this.loading = false;
      }
    },
    async generateGuest() {
      this.generateLoading = true;
      try {
        let username = Date.now().toString(32);
        let email = `${username}@guest.com`;
        let password = Math.random().toString(32);
        let payload = {
          username,
          email,
          password
        };
        await this.$store.dispatch("signUp", payload);
        this.username = username;
        this.password = password;
        this.rememberMe = true;
        this.$notify({
          group: "success",
          type: "success",
          text: "User generated successfully just click signin!"
        });
      } catch (err) {
        console.log(err);
        this.$notify({
          group: "errors",
          type: "error",
          text: "Oops, Something went wrong, Please try again!"
        });
      } finally {
        this.generateLoading = false;
      }
    }
  }
};
</script>

<style lang="scss">
.sign-in {
  perspective: length;
  position: relative;
  &__background {
    #wave-one {
      transform: rotate(180deg);
      position: absolute;
      bottom: 0px;
      left: 0;
    }
  }
}

.theme--light .sign-in {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
  }
}
.theme--dark .sign-in {
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #343538 inset !important;
  }

  input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
  }
}
</style>
