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
        {{ $t("forms.welcome") }}
      </v-card-title>

      <v-card-text>
        <v-form ref="signin">
          <v-text-field
            name="username"
            autocomplete="false"
            v-model="username"
            :label="$t('forms.username')"
            :rules="usernameRules"
          ></v-text-field>
          <v-text-field
            class="mt-4"
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            name="password"
            :label="$t('forms.password')"
            :rules="passwordRules"
            @click:append="show = !show"
          ></v-text-field>
          <v-checkbox
            name="rememberMe"
            v-model="rememberMe"
            :label="$t('forms.rememberMe')"
          >
          </v-checkbox>
          <router-link class="my-2 d-block" to="forgot_password">
            Forgot password ?
          </router-link>
          <router-link class="my-2 d-block" block to="resend_confirmation">
            Resend confirmation ?
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
        {{ $t("btn.signin") }}
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
        v =>
          !!v || this.$t("forms.username") + this.$t("forms.errors.required"),
        v =>
          this.$pattern.username.test(v) ||
          this.$t("forms.errors.invalid") + this.$t("forms.username")
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
      return this.$refs.signin.validate();
    }
  },
  methods: {
    handlesubmit() {
      if (this.valid) {
        let loader = this.$loading.show({ container: null, canCancel: false });
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
                  title: "authentication Error",
                  text: err.response.data.error.msg
                });
              } else if (
                err.response.status === 401 &&
                err.response.data.error.code === 1024
              ) {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: "authentication Error",
                  text: err.response.data.error.msg
                });
              } else if (
                err.response.status === 401 &&
                err.response.data.error.code === 1063
              ) {
                this.$notify({
                  group: "errors",
                  type: "warn",
                  title: "authentication Error",
                  text: err.response.data.error.msg
                });
              } else {
                this.$notify({
                  group: "errors",
                  type: "error",
                  title: "authentication Error",
                  text: "Something went wrong"
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
  }
}
</style>
