<template>
  <div class="settings bg">
    <v-expansion-panels multiple accordion>
      <v-expansion-panel class="bg">
        <v-expansion-panel-header>
          <span>
            <v-icon class="me-1 mt-n2" size="25">
              mdi-account-outline
            </v-icon>
            Account and privacy
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-flex align-center">
            <h3 class="font-weight-regular">Private</h3>
            <v-switch v-model="isPrivate" class="ms-6" />
          </div>
          <div class="d-flex flex-column">
            <h3 class="font-weight-regular">Change password</h3>
            <v-form class="mt-4" ref="password">
              <span>
                <v-text-field
                  outlined
                  dense
                  v-model="currentPassword"
                  :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword1 ? 'text' : 'password'"
                  name="password"
                  label="Current password"
                  :rules="passwordRules"
                  :error="error"
                  required
                  @click:append="showPassword1 = !showPassword1"
                />
                <v-text-field
                  outlined
                  dense
                  v-model="newPassword"
                  :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword2 ? 'text' : 'password'"
                  name="password"
                  label="New password"
                  :rules="passwordRules"
                  required
                  @click:append="showPassword2 = !showPassword2"
                />
                <v-text-field
                  outlined
                  dense
                  v-model="repeatPassword"
                  :error="repeatPassword !== newPassword"
                  :append-icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword3 ? 'text' : 'password'"
                  name="password"
                  label="Repeat new password"
                  :rules="passwordRules"
                  required
                  @click:append="showPassword3 = !showPassword3"
                />
              </span>
            </v-form>
            <v-btn
              :loading="loading"
              :disabled="loading"
              @click="saveAccountChanges"
              class="text-capitalize"
              elevation="0"
              dark
              color="#039c56"
            >
              Save changes
            </v-btn>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel class="bg">
        <v-expansion-panel-header>
          <span>
            <v-icon class="me-1 mt-n2" size="25">
              mdi-bell-outline
            </v-icon>
            Notifications and sound
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-flex align-center">
            <h3 class="font-weight-regular">Sound</h3>
            <v-switch v-model="sound" class="ms-6" />
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel class="bg">
        <v-expansion-panel-header>
          <span>
            <v-icon class="me-1 mt-n2" size="23">
              mdi-application-cog-outline
            </v-icon>
            Theme and language
          </span>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div class="d-inline-flex flex-column">
            <div class="ms-2 pb-2 d-flex">
              <span>Theme</span>
              <span class="ms-8">
                <DarkMode />
              </span>
            </div>
            <v-divider />
            <div class="pt-2 ms-2 d-flex">
              <span>Language</span>
              <span class="ms-8">
                <Locale />
              </span>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import DarkMode from "@/components/DarkMode";
import Locale from "@/components/Locale";
export default {
  components: { DarkMode, Locale },
  name: "Settings",
  data: () => ({
    isPrivate: false,
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
    showPassword1: false,
    showPassword2: false,
    showPassword3: false,
    sound: true,
    loading: false,
    error: false
  }),
  computed: {
    valid() {
      return this.$refs.password.validate();
    },
    passwordRules() {
      return [
        v => !!v || this.$t("signin.errors.prequired"),
        v => this.$pattern.password.test(v) || this.$t("signin.errors.invalidp")
      ];
    }
  },
  methods: {
    async saveAccountChanges() {
      try {
        let data = { isPrivate: this.isPrivate };
        let user = this.$store.getters.user;
        user.isPrivate = this.isPrivate;
        if (this.currentPassword && this.newPassword) {
          if (!this.valid) return;
          data.currPass = this.currentPassword;
          data.newPass = this.newPassword;
        }
        this.loading = true;
        this.error = false;
        const res = await this.$http.patch("/users", data);
        this.$store.dispatch("updateUserData", user);
        this.loading = false;
        this.$notify({
          group: "success",
          type: "success",
          text: "Changes has been saved successfully"
        });
      } catch (err) {
        this.loading = false;
        this.error = true;
        console.log(err);
      }
    }
  },
  mounted() {
    this.isPrivate = this.$store.getters.user.isPrivate;
  }
};
</script>

<style></style>
