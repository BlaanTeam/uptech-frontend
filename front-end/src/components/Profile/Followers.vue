<template>
  <v-dialog
    scrollable
    v-model="dialog.value"
    max-width="400px"
    class="followers"
  >
    <v-card class="bg edit-profile">
      <v-card-title>
        <h1 class="title d-inline-block float-left">Followers</h1>
        <v-icon @click="dialog.value = false" class="ms-auto">mdi-close</v-icon>
      </v-card-title>
      <v-card-text style="height: 80vh;" class="ps-3 py-3 px-0">
        <span v-for="user in users" :key="user._id">
          <div class="d-flex py-1">
            <div class="align-self-center">
              <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
            </div>
            <div cols="6" class="align-sefl-center mx-3">
              <h3 v-if="user.profile" class="text-capitilize">
                <span v-if="user.profile.firstName">
                  {{ user.profile.firstName }}
                </span>
                <span v-if="user.profile.lastName">
                  {{ user.profile.lastName }}
                </span>
              </h3>
              <h5 class="mt-n2">@{{ user.userName }}</h5>
            </div>
            <div class="align-self-center ms-auto me-1">
              <FollowUnfollow :userInfo="user" :myInfo="myInfo" />
            </div>
          </div>
        </span>
        <infinite-loading @infinite="infiniteHandler">
          <template slot="no-results">
            <h2 class="mt-4 px-2 font-weight-regular">
              This account doesn't have any followers yet
            </h2>
          </template>
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
      const api = `/users/${userName}/followers?page=${this.page}`;
      try {
        let res = await this.$http.get(api);
        if (res.status === 200) {
          if (res.data.followers.length) {
            this.page += 1;
            this.users.push(...res.data.followers);
            $state.loaded();
            if (res.data.followers.length < 10) $state.complete();
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
