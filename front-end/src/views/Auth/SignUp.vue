<template>
  <v-container fluid class="sign-up d-flex">
    <Wave class="background" />
    <v-row no-gutters class="sign-up__form align-center">
      <v-col class="align-self-end px-6 d-none d-sm-flex">
        <img
          src="@/assets/images/sign_up.svg"
          alt="Guest illustration"
          width="350"
        />
      </v-col>
      <v-col class="px-10 align-self-start mt-10">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            prepend-icon="mdi-account"
            class="my-6"
            v-model="username"
            :counter="16"
            :rules="usernameRules"
            label="Username"
            required
            type="text"
            name="username"
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
            class="my-6"
            v-model="password"
            :type="show1 ? 'text' : 'password'"
            label="Password"
            required
            name="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="show1 = !show1"
          ></v-text-field>

          <v-checkbox
            class="ml-2"
            v-model="checkbox"
            :rules="[v => !!v || 'You must agree to continue!']"
            label="Do you agree ?"
            required
          ></v-checkbox>

          <v-btn color="#F9A826" dark class="ml-2 mt-6" elevation="0" rounded>
            Continue
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Wave from "@/components/svg/SignUpSvg";
export default {
  components: {
    Wave
  },
  data: () => ({
    valid: false,
    username: "",
    password: "",
    show1: false,
    usernameRules: [
      v => !!v || "Name is required",
      v => (v && v.length <= 16) || "Name must be less than 10 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    select: null,
    checkbox: false
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
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
    fill: #e7e6e6;
  }
  &__form {
    max-width: 90vw;
    margin: 0 auto;
  }
}
</style>
