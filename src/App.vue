<template>
  <div>
    <notifications :duration="10000" position="bottom right" group="errors">
    </notifications>
    <notifications :duration="10000" position="bottom left" group="success">
    </notifications>

    <UnAuthLayout v-if="!$store.getters.isLoggedIn" :style="unAuthBackground">
      <v-main>
        <router-view></router-view>
      </v-main>
    </UnAuthLayout>

    <AuthLayout
      v-else-if="$route.path.startsWith('/messages')"
      :style="authBackground"
    >
      <v-main>
        <router-view class="chat-view"></router-view>
      </v-main>
    </AuthLayout>

    <AuthLayout v-else :style="authBackground">
      <v-main>
        <div class="d-flex">
          <div>
            <AppBar />
            <!-- <keep-alive :max="4" :include="includes"> -->
            <router-view class="router-view"></router-view>
            <!-- </keep-alive> -->
          </div>
          <v-divider vertical />
          <div class="right-side">
            <div class="trending auth-secondarybg">
              <div class="soon">soon</div>
              <div class="title">Trends for you</div>
              <div class="trend">
                <span class="font-weight-light caption">
                  Trending in Morocco
                </span>
                <span>#NFTdrop</span>
                <span class="font-weight-light caption">128K Posts</span>
              </div>
              <div class="trend" v-for="i in 2" :key="i">
                <span class="font-weight-light caption">
                  Technology · Trending
                </span>
                <span>Uptech</span>
                <span class="font-weight-light caption">561K Posts</span>
              </div>
              <div class="trend" v-for="i in 3" :key="i + 4">
                <span class="font-weight-light caption">
                  Trending in Morocco
                </span>
                <span>#Morocco</span>
                <span class="font-weight-light caption">1,437 Posts</span>
              </div>
              <div class="mt-2">
                <span class="primary--text">See more</span>
              </div>
            </div>
            <div class="search auth-secondarybg">
              <span class="soon">soon</span>
              <span>Search</span>
            </div>
          </div>
        </div>
      </v-main>
    </AuthLayout>
  </div>
</template>

<script>
import UnAuthLayout from "./layouts/UnAuthLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AppBar from "@/layouts/partials/Auth/AppBar";

export default {
  components: {
    UnAuthLayout,
    AuthLayout,
    AppBar
  },
  data: () => ({
    includes: ["Profile"]
  }),
  computed: {
    unAuthBackground() {
      return { background: this.$vuetify.theme.currentTheme.bg };
    },
    authBackground() {
      return { background: this.$vuetify.theme.currentTheme["auth-bg"] };
    }
  },
  watch: {
    "$i18n.locale"() {
      document.title = `${this.$t("appName")} | ${this.$t(
        this.$route.meta.title
      )}`;
    }
  }
};
</script>
<style lang="scss">
.auth-layout .v-application--wrap {
  max-width: 1400px !important;
  margin: 0 auto !important;
}
a {
  text-decoration: none;
  color: white;
}
main {
  min-height: 100vh;
  width: 100%;
}
.v-application a {
  color: inherit !important;
}
.router-view {
  width: 50vw;
  max-width: 700px;
  min-height: 93vh;
}
.right-side {
  width: 30vw;
  position: relative;
  padding: 4px 10px 10px 10px;
  .search {
    position: fixed;
    top: 2px;
    border-radius: 10px;
    width: 100%;
    max-width: 380px;
    height: 45px;
    max-height: 45px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-weight: 300;
    font-size: 15px;
  }
  .trending {
    position: fixed;
    border-radius: 10px;
    max-width: 380px;
    width: 100%;
    height: 100%;
    max-height: 90vh;
    padding: 10px 20px;
    display: flex;
    flex-direction: column;
    max-height: 590px;
    .trend {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
    }
  }
}
.soon {
  position: absolute;
  right: 0;
  top: 10px;
  transform: rotate(45deg);
  background: rgb(4, 192, 67);
  padding: 0px 6px 1px 6px;
  border-radius: 15px;
}
.theme--light {
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #b9b9b9;
  }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: #9e9e9e;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #999999;
  }
}
.theme--dark {
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #3d3d3d;
  }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: #2b2b2b;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #19191d;
  }
}
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
.underlined:hover {
  text-decoration: underline;
}
</style>
