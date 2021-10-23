<template>
  <v-dialog v-model="dialog" max-width="250px">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot>
          <v-btn tile block text class="text-capitalize justify-start ">
            <v-icon small left>mdi-lock-open-variant-outline</v-icon>
            unblock
          </v-btn>
        </slot>
      </span>
    </template>
    <div class="bg">
      <v-row class="justify-center pt-2" no-gutters>
        <img src="@/assets/images/avatar.svg" width="80" alt="" />
      </v-row>
      <v-row class="text-center py-1 px-6" no-gutters>
        <p>
          your are going to unBlock <strong>@{{ userInfo.userName }}</strong>
        </p>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters class="justify-center">
        <v-btn
          plain
          text
          tile
          color="red"
          :loading="blockLoading"
          @click="unBlockUser"
          class="text-capitalize"
        >
          <v-icon small left>mdi-lock-open-variant-outline</v-icon>
          unblock
        </v-btn>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters class="justify-center">
        <v-btn
          plain
          text
          tile
          class="text-capitalize justify-center"
          @click="dialog = false"
        >
          {{ $t("cancel") }}
        </v-btn>
      </v-row>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "Unblock",
  props: {
    userInfo: { type: Object, required: false }
  },
  data: () => ({
    blockLoading: false,
    dialog: false
  }),
  methods: {
    async unBlockUser() {
      this.blockLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.delete(`/users/blocks/${userName}`);
        if (res.status === 204) {
          this.userInfo.blockedByViewer = false;
          this.userInfo.followedByViewer = false;
          this.userInfo.requestedByViewer = false;
          console.log("Unblock.vue: User UnBlocked :)");
        } else
          console.log(
            "Unblock.vue(unBlockUser): No error but nothing changed :("
          );
        this.blockLoading = false;
        this.dialog = false;
      } catch (err) {
        console.log("Something went wrong from:Unblock.vue (unBlockUser)");
        this.blockLoading = false;
        console.log(err);
      }
    }
  }
};
</script>
