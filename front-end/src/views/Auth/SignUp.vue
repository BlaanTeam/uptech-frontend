<template>
  <v-container fluid class="sign-up d-flex">
    <div class="background">
      <img src="@/assets/images/wave.svg" alt="wave svg background" />
    </div>
    <v-row class="align-center">
      <v-col cols="5" offset="1" class="mt-4">
        <img
          src="@/assets/images/sign_up.svg"
          alt="Guest illustration"
          width="350"
        />
      </v-col>
      <v-col cols="5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            prepend-icon="mdi-account"
            dense
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
            dense
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
            dense
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

          <v-btn color="blue" dark class="ml-2 mt-6" elevation="0" rounded>
            Continue
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
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
  padding: 0;
  margin: 0;
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
}
</style>
