<template>
  <v-dialog
    scrollable
    v-model="dialog"
    max-width="400px"
    class="new-conversation"
  >
    <template v-slot:activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        <slot>
          <v-btn color="primary" class="mt-10">
            start new conversation
          </v-btn>
        </slot>
      </span>
    </template>
    <v-card class="bg new-conversation">
      <v-card-title class="bg header d-flex align-center">
        <h3 class="title d-inline-block float-left">To:</h3>
        <v-textarea
          id="sendMessageTextArea"
          class="mx-4"
          hide-details
          autofocus
          rounded
          filled
          auto-grow
          dense
          :rows="1"
        ></v-textarea>
      </v-card-title>
      <v-list class="bg pt-16" height="80%">
        <v-list-item-group dense class="bg">
          <div
            @click="createNewConversation(user)"
            v-for="(user, i) in users"
            :key="i"
          >
            <v-list-item dense>
              <v-list-item-avatar>
                <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  <span>{{ user.profile.firstName }}</span>
                  <span class="ms-1">{{ user.profile.lastName }}</span>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span> @{{ user.userName }} </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </v-list-item-group>
        <infinite-loading @infinite="infiniteHandler">
          <template slot="no-results">
            <h2 class="mt-4 px-2 font-weight-regular">
              you don't follow any other accounts yet
            </h2>
          </template>
        </infinite-loading>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    users: [],
    dialog: false,
    page: 1
  }),
  methods: {
    async infiniteHandler($state) {
      let userName = this.$store.getters.getUserName;
      const api = `/users/${userName}/following?page=${this.page}`;
      try {
        let res = await this.$http.get(api);
        if (res.status === 200) {
          if (res.data.following.length) {
            this.page += 1;
            this.users.push(...res.data.following);
            $state.loaded();
            if (res.data.following.length < 10) $state.complete();
          } else {
            $state.complete();
          }
        }
      } catch (err) {
        $state.error();
        console.log(err);
      }
    },
    async createNewConversation(user) {
      let res = await this.$store.dispatch("initiateNewConversation", user);
      this.$router.push({ name: "ViewMessages", params: { id: res._id } });
      this.dialog = false;
    }
  }
};
</script>

<style>
.new-conversation {
  min-height: 80vh;
}
.new-conversation .header {
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 205;
  position: fixed;
  margin: 0 auto;
  width: 400px;
}
@media (max-width: 450px) {
  .new-conversation .header {
    width: 86vw;
  }
}
</style>
