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
            <v-text-field
              v-model="profile.firstName"
              outlined
              dense
              required
              label="First Name"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="profile.lastName"
              outlined
              dense
              label="Last Name"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-textarea v-model="profile.bio" outlined dense label="Bio" />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="profile.location"
              type="country"
              outlined
              dense
              label="Location"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="profile.website"
              type="url"
              outlined
              label="Website"
            />
          </v-col>
        </v-row>
        <div>Birth Date</div>
        <v-row no-gutters class="mt-2">
          <v-col class="me-4">
            <v-select :items="months" label="Month" dense outlined />
          </v-col>
          <v-col class="me-4">
            <v-text-field
              label="Day"
              dense
              outlined
              type="number"
              min="1"
              max="31"
            />
          </v-col>
          <v-col>
            <v-text-field
              label="Year"
              dense
              outlined
              type="number"
              min="1901"
              max="2020"
            />
          </v-col>
          <!-- <v-col>
            <v-text-field
              v-model="profile.birthDate"
              outlined
              label="Birth Date"
            />
          </v-col> -->
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
  props: { profile: { type: Object, required: true } },
  data: () => ({
    dialog: false,
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ]
  }),
  mounted() {
    console.log("edit post mounted");
  }
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
