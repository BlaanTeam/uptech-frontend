<template>
  <span>
    <v-btn
      width="120"
      class="text-capitalize mx-4 secondarybg"
      elevation="0"
      rounded
      v-if="userInfo.hasRequestedViewer"
      @click="reject"
      :loading="rejectLoading"
      :disabled="rejectLoading"
    >
      <v-icon small left>mdi-account-cancel</v-icon>
      Reject
    </v-btn>
    <v-btn
      width="120"
      class="text-capitalize secondarybg"
      elevation="0"
      rounded
      v-if="userInfo.rejectedByViewer"
      @click="unReject"
      :loading="rejectLoading"
      :disabled="rejectLoading"
    >
      <v-icon small left>mdi-account-cancel</v-icon>
      unReject
    </v-btn>
  </span>
</template>

<script>
export default {
  name: "RejectUnreject",
  props: { userInfo: { type: Object, required: true } },
  data: () => ({
    rejectLoading: false
  }),
  methods: {
    async reject() {
      this.rejectLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.put(`/users/rejects/${userName}`);
        if (res) {
          this.userInfo.rejectedByViewer = true;
          this.userInfo.hasRequestedViewer = false;
          console.log("RejectUnreject.vue(reject): Request rejected :)");
        } else
          console.log(
            "RejectUnreject.vue(reject): No error but nothing changed :("
          );

        this.rejectLoading = false;
      } catch (err) {
        console.log("Something went wrong from:RejectUnreject.vue (reject)");
        this.rejectLoading = false;
        console.log(err);
      }
    },
    async unReject() {
      this.rejectLoading = true;
      try {
        let userName = this.userInfo.userName;
        let res = await this.$http.delete(`/users/rejects/${userName}`);
        if (res.status === 204) {
          this.userInfo.rejectedByViewer = false;
          console.log("RejectUnreject.vue(unReject): Request unRejected :)");
        } else
          console.log(
            "RejectUnreject.vue(unReject): No error but nothing changed :("
          );

        this.rejectLoading = false;
      } catch (err) {
        console.log("Something went wrong from:RejectUnreject.vue (unReject)");
        this.rejectLoading = false;
        console.log(err);
      }
    }
  }
};
</script>
