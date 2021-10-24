<template>
  <div>
    <v-tooltip bottom color="#2F3136" nudge-top="10" nudge-right="5">
      <template #activator="{attrs,on}">
        <v-btn
          @click="displayDialog"
          v-bind="attrs"
          v-on="on"
          icon
          text
          width="32"
          height="32"
          color="primary"
          class="ms-3"
        >
          <v-icon size="20">mdi-check-all</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("clearAll") }}</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="400">
      <v-card class="auth-bg py-4 px-1">
        <v-card-title class="pb-6 justify-center">
          <h1 class="subtitle-1">
            {{ $t("deleteNotifsAlert") }}
            <v-icon size="18" class="ms-1 mt-n1">mdi-delete-alert</v-icon>
          </h1>
        </v-card-title>
        <v-card-actions class="justify-center">
          <v-btn
            @click="removeNotifs"
            elevation="0"
            color="red"
            width="100"
            class="mr-10 text-capitalize pe-4"
            :loading="loading"
            :disabled="loading"
          >
            <v-icon left size="18" class="mt-n1">mdi-delete-empty</v-icon>
            {{ $t("clear") }}
          </v-btn>

          <v-btn
            elevation="0"
            width="100"
            class="ml-10 text-capitalize px-4"
            @click="dialog = false"
            color="secondarybg"
          >
            {{ $t("cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "RemoveNotifs",
  data: () => ({
    dialog: false,
    loading: false
  }),
  methods: {
    async removeNotifs() {
      this.loading = true;
      try {
        await this.$store.dispatch("removeNotifs");
        this.loading = false;
        this.dialog = false;
      } catch (err) {
        this.loading = false;
        console.log(err);
      }
    },
    displayDialog() {
      if (!this.$store.getters.notifications.length) return;
      this.dialog = true;
    }
  }
};
</script>

<style></style>
