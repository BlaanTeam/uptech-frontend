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
            <span class="mt-4">
              <v-text-field
                outlined
                dense
                v-model="currentPassword"
                :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword1 ? 'text' : 'password'"
                name="password"
                label="Current password"
                :rules="passwordRules"
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
            <v-btn class="text-capitalize" elevation="0" color="#039c56">
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
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data: () => ({
    isPrivate: false,
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
    showPassword1: false,
    showPassword2: false,
    showPassword3: false,
    sound: true
  })
};
</script>

<style></style>
