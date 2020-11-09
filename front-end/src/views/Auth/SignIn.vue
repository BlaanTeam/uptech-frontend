<template>
  <v-container fluid fill-height class="sign-in">
    <div class="sign-in__background">
      <WaveSvg />
    </div>
    <CloudSvg
      v-for="(n, i) in ['one', 'two', 'three', 'four']"
      :key="i"
      :id="n"
    />
    <v-card class="mx-auto" width="550">
      <v-avatar color="#F9A826">
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>

      <v-card-title class="display-1 justify-center brown--text">
        Welcome Back
      </v-card-title>

      <v-card-text>
        <v-form>
          <v-text-field
            v-model="email"
            :rules="[rules.required, rules.email]"
            label="E-mail"
            hint="test"
          ></v-text-field>
          <v-text-field
            class="my-6"
            v-model="password"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show1 ? 'text' : 'password'"
            name="password"
            label="Password"
            @click:append="show1 = !show1"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-btn block class="py-6" color="#d18409" dark elevation="0">
        Login
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
  data: () => ({
    valid: false,
    show1: false,
    password: "",
    rules: {
      required: value => !!value || "Required.",
      min: v => v.length >= 8 || "At least 8 characters",
      emailMatch: () => `The email and password you entered don't match`
    },
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v =>
        /^\w+([/.-]?\w+)*@\w+([/.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        "E-mail must be valid"
    ]
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.$refs.form.$el.submit();
      }
    },
    clear() {
      this.$refs.form.reset();
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
      // color: #d18409
      fill: rgb(207, 206, 206);
    }
  }

  #one,
  #two,
  #three,
  #four {
    position: absolute;
    fill: #e0e0e0;
  }
  #one {
    top: 50px;
    left: 0;
  }
  #two {
    top: -10px;
    left: 20%;
  }
  #three {
    top: -30px;
    left: 60%;
  }
  #four {
    top: 20px;
    right: 0;
  }
}
</style>
