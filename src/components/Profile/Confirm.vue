<template>
  <v-btn
    class="text-capitalize me-4"
    elevation="0"
    dark
    color="primary"
    rounded
    width="120"
    :loading="confirmLoading"
    :disabled="confirmLoading"
    @click="confirm"
  >
    <v-icon small left>mdi-account-check</v-icon>
    Confirm
  </v-btn>
</template>

<script>
export default {
  name: "Confirm",
  props: { userInfo: { type: Object, required: true } },
  data: () => ({
    confirmLoading: false
  }),
  methods: {
    async confirm() {
      this.confirmLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/accepts/${userName}`);
        if (res.status === 204) {
          this.userInfo.followsViewer = true;
          this.userInfo.hasRequestedViewer = false;
          console.log("Confirm.vue(confirm): Request accepted :)");
        } else
          console.log("Confirm.vue(confirm): No error but nothing changed :(");

        this.confirmLoading = false;
      } catch (err) {
        console.log("Something went wrong from:Confirm.vue (confirm)");
        this.confirmLoading = false;
        console.log(err);
      }
    }
  }
};
</script>
