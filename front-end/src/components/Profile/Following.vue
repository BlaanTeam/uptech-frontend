<template>
  <v-dialog scrollable v-model="dialog.value" max-width="400px">
    <v-card class="bg edit-profile">
      <v-card-title class="justify-center">
        <h1 class="title ms-2">Following</h1>
      </v-card-title>
      <v-card-text style="height: 80vh;" class="ps-3 py-3 px-0">
        <span v-for="user in users" :key="user._id">
          <div class="d-flex py-1">
            <div class="align-self-center">
              <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
            </div>
            <div cols="6" class="align-sefl-center mx-3">
              <h3 class="text-capitilize">
                {{ user.profile.firstName }}
                {{ user.profile.lastName }}
              </h3>
              <h5 class="mt-n2">@{{ user.userName }}</h5>
            </div>
            <div class="align-self-center ms-auto me-1">
              <FollowUnfollow :userInfo="user" :myInfo="myInfo" />
            </div>
          </div>
        </span>
        <infinite-loading @infinite="infiniteHandler">
          <!-- Todo: add custom messages -->
        </infinite-loading>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import FollowUnfollow from "./FollowUnfollow";

export default {
  components: { FollowUnfollow },
  props: { userName: String, myInfo: { required: false }, dialog: Object },
  data: () => ({
    users: [],
    page: 1
  }),
  methods: {
    async infiniteHandler($state) {
      let userName = this.userName;
      const api = `/users/${userName}/following?page=${this.page}`;
      try {
        let res = await this.$http.get(api);
        if (res.status === 200) {
          if (res.data.following.length) {
            this.page += 1;
            this.users.push(...res.data.following);
            $state.loaded();
          } else {
            $state.complete();
          }
        }
      } catch (err) {
        $state.error();
        console.log(err);
      }
    }
  }
};
</script>

<style>
.edit-profile .v-card__title {
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
}
</style>
