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
              :label="$t('firstName')"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="profile.lastName"
              outlined
              dense
              :label="$t('lastName')"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-textarea
              v-model="profile.bio"
              outlined
              dense
              :label="$t('bio')"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-text-field
              v-model="profile.location"
              type="country"
              outlined
              dense
              :label="$t('location')"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col>
            <v-text-field
              placeholder="https://example.com"
              v-model="profile.website"
              type="url"
              outlined
              :label="$t('website')"
            />
          </v-col>
        </v-row>
        <div>{{ $t("birthDay") }}</div>
        <v-row no-gutters class="mt-2">
          <v-col class="me-4">
            <v-select :items="months" :label="$t('Month')" dense outlined />
          </v-col>
          <v-col class="me-4">
            <v-text-field
              :label="$t('day')"
              dense
              outlined
              type="number"
              min="1"
              max="31"
            />
          </v-col>
          <v-col>
            <v-text-field
              :label="$t('year')"
              dense
              outlined
              type="number"
              min="1901"
              max="2020"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <h1 class="title ms-2">{{ $t("viewProfile.editProfile") }}</h1>
        <v-spacer></v-spacer>
        <a class="text-capitalize caption me-8" text @click="dialog = false">
          {{ $t("cancel") }}
        </a>
        <v-btn
          elevation="0"
          dark
          height="30"
          color="primary text-capitalize me-2"
          :disabled="loading"
          :loading="loading"
          @click="edit"
        >
          <v-icon left size="16" class="">mdi-content-save</v-icon>
          {{ $t("save") }}
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
    loading: false
  }),
  computed: {
    months() {
      return this.$t("months");
    }
  },
  methods: {
    async edit() {
      this.loading = true;
      console.log(this.profile);
      try {
        if (this.profile.isPrivate == undefined) this.profile.isPrivate = false;
        const res = await this.$http.patch("/users", {
          profile: {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            bio: this.profile.bio,
            location: this.profile.location,
            website: this.profile.website
          }
        });
        console.log("Edit.vue(edit): Profile edited successfully :)");
        this.loading = false;
        this.dialog = false;
      } catch (err) {
        this.loading = false;
        console.log("Edit.vue(edit): Something went wrong :(");
        console.log(err);
      }
    }
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
