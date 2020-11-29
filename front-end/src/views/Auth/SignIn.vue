<template>
  <v-container fluid fill-height class="sign-in">
    <div class="sign-in__background">
      <WaveSvg :fillColor="$theme.currentTheme.secondarybg" />
    </div>
    <CloudSvg
      v-for="(n, i) in ['one', 'two', 'three', 'four']"
      :key="i"
      :id="n"
      :fillColor="$theme.currentTheme.secondarybg"
    />
    <v-card class="mx-auto bg lighten-1" width="550">
      <v-avatar class="d-block mx-auto primary" width="60px">
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>

      <v-card-title class="display-1 justify-center">
        {{ $t("signin.h1") }}
      </v-card-title>

      <v-card-text>
        <v-form ref="signin">
          <v-text-field
            name="username"
            autocomplete="false"
            v-model="username"
            :label="$t('signin.form.username')"
            :rules="usernameRules"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            name="password"
            :label="$t('signin.form.password')"
            :rules="passwordRules"
            @click:append="show = !show"
          ></v-text-field>
          <v-checkbox
            name="rememberMe"
            v-model="rememberMe"
            :label="$t('signin.form.rememberMe')"
          >
          </v-checkbox>
          <router-link class="my-2 d-block" to="forgot_password">
            {{ $t("signin.form.forgotPassword") }}
          </router-link>
          <router-link class="my-2 d-block" block to="resend_confirmation">
            {{ $t("signin.form.resendConfirmation") }}
          </router-link>
        </v-form>
      </v-card-text>
      <v-btn
        @click="handlesubmit()"
        block
        class="py-6"
        color="primary"
        dark
        elevation="0"
      >
        {{ $t("signin.name") }}
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import WaveSvg from "@/components/svg/WaveSvg";
import CloudSvg from "@/components/svg/CloudSvg";

export default {
  components: {
    WaveSvg,
    CloudSvg
  },
  data() {
    return {
      show: false,
      // models
      username: "",
      password: "",
      rememberMe: false
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
    handlesubmit() {
      if (this.valid) {
        let loader = this.$loading.show({
          container: null,
          canCancel: false
        });
        this.$store
          .dispatch("signIn", {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
          })
          .then(res => {
            loader.hide();
            if (res.status === 200 && res.data.code === 2032) {
              this.$router.push({ name: "Feeds" });
            }
          })
          .catch(err => {
            loader.hide();
            this.password = "";
            if (err.response) {
              if (
                err.response.status === 404 &&
                err.response.data.error.code === 1030
              ) {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: this.$t("signin.errors.auth"),
                  text: this.$t("signin.errors.notRegistredYet")
                });
              } else if (
                err.response.status === 401 &&
                err.response.data.error.code === 1024
              ) {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: this.$t("signin.errors.auth"),
                  text: this.$t("signin.errors.invalid")
                });
              } else if (
                err.response.status === 401 &&
                err.response.data.error.code === 1063
              ) {
                this.$notify({
                  group: "errors",
                  type: "warn",
                  title: this.$t("signin.errors.auth"),
                  text: this.$t("signin.errors.notConfirmed")
                });
              } else {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: "authentication Error",
                  text: this.$t("globals.errors.wentWrong")
                });
              }
            }
          });
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

  #one,
  #two,
  #three,
  #four {
    position: absolute;
  }
  #one {
    top: 100px;
    left: -15%;
  }
  #two {
    top: -5px;
    left: 20%;
  }
  #three {
    top: -20px;
    left: 50%;
  }
  #four {
    top: 20px;
    right: 0;
    color: #f5c55e;
  }
}
</style>
