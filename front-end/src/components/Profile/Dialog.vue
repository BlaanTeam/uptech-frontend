<template>
  <v-dialog scrollable v-model="dialog" max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot></slot>
      </span>
    </template>
    <v-card class="bg edit-profile">
      <v-card-text style="height: 80vh;">
        <v-row class="justify-center py-4 image" no-gutters>
          <img
            src="@/assets/images/avatar.svg"
            width="150"
            height="150"
            color="primary"
          />
          <v-btn icon class="edit-img auth-bg lighten-2" color="primary">
            <v-icon>
              mdi-square-edit-outline
            </v-icon>
          </v-btn>
        </v-row>
        <v-row no-gutters>
          <v-col class="me-4">
            <v-text-field outlined dense label="First Name"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field outlined dense label="Last Name"></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-textarea outlined dense label="Bio"></v-textarea>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field outlined dense label="Location"></v-text-field>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field outlined label="Website"></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field outlined label="Birth Date"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <h1 class="title ms-2">Edit Profile</h1>
        <v-spacer></v-spacer>
        <a class="text-capitalize caption me-8" text @click="dialog = false">
          Cancel
        </a>
        <v-btn
          elevation="0"
          dark
          height="30"
          color="primary text-capitalize me-2"
          @click="dialog = false"
        >
          <v-icon left size="16" class="">mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  })
};
</script>

<style>
.edit-profile .v-card__actions {
  box-shadow: 0px -3px 10px rgba(0, 0, 0, 0.2);
}
.edit-profile .v-card__actions a:hover {
  text-decoration: underline;
}
.edit-profile .image {
  position: relative;
}
.edit-profile .edit-img {
  position: absolute;
  left: 47%;
  top: 42%;
}
</style>
