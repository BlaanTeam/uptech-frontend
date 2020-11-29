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
      <v-avatar class=" pa-0 ma-0 d-block mx-auto primary" width="60px">
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>
      <v-card-title class="pt-0 mt-0 mb-2 display-1 justify-center">
        {{ $t("signin.h1") }}
      </v-card-title>
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
        <!-- <v-btn class="me-2 py-1 px-6" color="secondarybg" rounded elevation="0">
          Log In with
          <v-icon right color="primary" size="20">mdi-google</v-icon>
        </v-btn>
        <v-btn class="ms-2 py-1 px-6" color="secondarybg" rounded elevation="0">
          Log In with
          <v-icon right color="primary" size="22">mdi-facebook</v-icon>
        </v-btn> -->
      </v-card-subtitle>
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
// import CloudSvg from "@/components/svg/CloudSvg";

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
              if (this.$route.query.nextPath) {
                this.$router
                  .push({ name: this.$route.query.nextPath })
                  .then(null, err => {
                    this.$router.push({ name: "NotFound" });
                  });
              } else this.$router.push({ name: "Feeds" });
            }
          })
          .catch(({ response }) => {
            loader.hide();
            this.password = "";
            if (
              response?.status === 404 &&
              response?.data?.error?.code === 1030
            ) {
              this.errorNotification(this.$t("signin.errors.notRegistredYet"));
            } else if (
              response?.status === 401 &&
              response?.data?.error?.code === 1024
            ) {
              this.errorNotification(this.$t("signin.errors.invalid"));
            } else if (
              response?.status === 401 &&
              response?.data?.error?.code === 1063
            ) {
              this.errorNotification(
                this.$t("signin.errors.notConfirmed"),
                "warn"
              );
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
