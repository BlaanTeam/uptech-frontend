<template>
  <div class="suggestions  auth-secondarybg">
    <div class="title">Who to follow</div>
    <div
      v-for="user in users"
      :key="user._id"
      class="d-flex suggestion py-1"
      :id="'suggestion' + user._id"
    >
      <div class="align-self-center">
        <router-link
          :to="{
            name: 'ViewProfile',
            params: { userName: user.userName }
          }"
        >
          <img src="@/assets/images/avatar.svg" width="36" alt="Avatar" />
        </router-link>
      </div>
      <div class="px-3 ">
        <router-link
          :to="{
            name: 'ViewProfile',
            params: { userName: user.userName }
          }"
        >
          <h3 class="text-capitilize suggestions__fullname">
            {{ user.profile.firstName }}
            {{ user.profile.lastName }}
          </h3>
          <h5 class="mt-n2">@{{ user.userName }}</h5>
        </router-link>
      </div>
      <div v-if="!user.isOwner" class="align-self-center ms-auto me-1">
        <FollowUnfollow :userInfo="user" @followed="removeFollowed(user)" />
      </div>
    </div>
  </div>
</template>

<script>
import FollowUnfollow from "@/components/Profile/FollowUnfollow";

export default {
  components: { FollowUnfollow },
  name: "UsersSuggestion",
  data: () => ({
    users: []
  }),
  methods: {
    removeFollowed(user) {
      const el = document.querySelector("#suggestion" + user._id);
      el.style.transition = "all 0.5s ease-in-out";
      el.setAttribute("data-delete", "true");
      setTimeout(() => {
        el.remove();
        const index = this.users.indexOf(user);
        this.users.splice(index, 1);
      }, 500);
    },
    async getSuggestions() {
      try {
        let res = await this.$http.get("/suggestions");
        this.users = res.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  watch: {
    "users.length"(newVal) {
      if (newVal <= 2) this.getSuggestions();
    }
  },
  mounted() {
    this.getSuggestions();
  }
};
</script>

<style>
.suggestion[data-delete="true"] {
  transform: translateX(-100vh);
  opacity: 0;
}
.suggestions {
  overflow: hidden;
  border-radius: 10px;
  width: 100%;
  height: 33.5%;
  padding: 6px 20px;
  margin: 10px 0 0 0;
  display: flex;
  flex-direction: column;
}
.suggestions__fullname {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
