<template>
  <v-dialog v-model="dialog" max-width="250px">
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot>
          <v-btn tile block text class="text-capitalize justify-start pe-6">
            <v-icon small left>mdi-cancel</v-icon>
            block
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
          your are going to block <strong>@{{ userInfo.userName }}</strong>
        </p>
      </v-row>
      <v-divider></v-divider>
      <v-row no-gutters class="justify-center">
        <v-btn
          plain
          text
          tile
          :loading="blockLoading"
          @click="blockUser"
          class="text-capitalize"
          color="red"
        >
          <v-icon small left>mdi-cancel</v-icon>
          block
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
          Cancel
        </v-btn>
      </v-row>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "BlockUnblock",
  props: {
    userInfo: { type: Object, required: false }
  },
  data: () => ({
    blockLoading: false,
    dialog: false
  }),
  methods: {
    async blockUser() {
      this.blockLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/blocks/${userName}`);
        if (res.status === 204) {
          this.userInfo.blockedByViewer = true;
          console.log("Menu.vue: User Blocked :)");
        } else
          console.log("Menu.vue(blockUser): No error but nothing changed :(");

        this.blockLoading = false;
        this.dialog = false;
      } catch (err) {
        console.log("Something went wrong from:Menu.vue (blockUser)");
        this.blockLoading = false;
        console.log(err);
      }
    }
  }
};
</script>
