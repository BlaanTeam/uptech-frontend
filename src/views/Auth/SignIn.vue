<template>
  <v-container fluid fill-height class="sign-in">
    <div class="sign-in__background">
      <WaveSvg :fillColor="$theme.currentTheme.secondarybg" />
    </div>
    <!-- <CloudSvg
      v-for="(n, i) in ['one', 'two', 'three', 'four']"
      :key="i"
      :id="n"
      :fillColor="$theme.currentTheme.secondarybg"
    /> -->
    <v-card class="mx-auto bg lighten-1" width="550">
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
        >
          <v-icon left>mdi-account-arrow-up-outline</v-icon>
          Generate a random user
        </v-btn>
      </v-card-subtitle>
      <!--
         <v-card-subtitle class="my-2 text-center">
          <v-btn
          class="me-2 py-1 text-none my-1"
          color="secondarybg"
          rounded
          elevation="0"
        >
          <v-icon left color="#ff0000">mdi-google</v-icon>
          {{ $t("signin.google") }}
        </v-btn>
        <v-btn
          class="ms-2 py-1 text-none my-1"
          color="secondarybg"
          rounded
          elevation="0"
        >
          <v-icon left color="blue">mdi-facebook</v-icon>
          {{ $t("signin.facebook") }}
        </v-btn>
        <v-btn class="me-2 py-1 px-6" color="secondarybg" rounded elevation="0">
          Log In with
          <v-icon right color="primary" size="20">mdi-google</v-icon>
        </v-btn>
        <v-btn class="ms-2 py-1 px-6" color="secondarybg" rounded elevation="0">
          Log In with
          <v-icon right color="primary" size="22">mdi-facebook</v-icon>
        </v-btn>
      </v-card-subtitle> -->
      <v-card-text class="pa-0 ma-0">
        <v-form
          ref="signin"
          v-model="validity"
          @submit.prevent="handlesubmit()"
        >
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
// import CloudSvg from "@/components/svg/CloudSvg";

export default {
  components: {
    WaveSvg
    // CloudSvg
  },
  data() {
    return {
      show: false,
      // models
      username: "",
      password: "",
      rememberMe: false,
      validity: false,
      loading: false
    };
  },
  computed: {
    usernameRules() {
      return [
        v => !!v || this.$t("signin.errors.urequired"),
        v => this.$pattern.username.test(v) || this.$t("signin.errors.invalidu")
      ];
    },
    passwordRules() {
      return [
        v => !!v || this.$t("signin.errors.prequired"),
        v => this.$pattern.password.test(v) || this.$t("signin.errors.invalidp")
      ];
    },
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
    handlesubmit() {
      if (this.valid) {
        this.loading = true;
        this.$store
          .dispatch("signIn", {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
          })
          .then(res => {
            this.loading = false;
            if (res.status === 200) {
              if (this.$route.query.nextPath) {
                this.$router
                  .push({
                    name: this.$route.query.nextPath,
                    params: this.$route.params
                  })
                  .then(null, err => {
                    this.$router.push({ name: "NotFound" });
                  });
              } else this.$router.push({ name: "Feeds" });
            }
          })
          .catch(({ response }) => {
            this.loading = false;
            if (response?.status === 404) {
              this.errorNotification(this.$t("signin.errors.notRegistredYet"));
            } else if (
              response?.status === 401 &&
              response?.data.error.notConfirmed
            ) {
              this.errorNotification(
                this.$t("signin.errors.notConfirmed"),
                "warn"
              );
            } else if (response?.status === 401) {
              this.errorNotification(this.$t("signin.errors.invalid"));
            }
          });
      }
    },
    async generateGuest() {
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
