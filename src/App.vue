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
      <v-main class="auth-main">
        <div class="auth-main__container">
          <router-view class="chat-view"></router-view>
        </div>
      </v-main>
    </AuthLayout>

    <AuthLayout v-else :style="authBackground">
      <v-main class="auth-main">
        <div class="d-flex">
          <div class="auth-main__container">
            <AppBar />
            <!-- <keep-alive :max="4" :include="includes"> -->
            <router-view class="router-view"></router-view>
            <!-- </keep-alive> -->
          </div>
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
export default {
  components: {
    UnAuthLayout: () => import("./layouts/UnAuthLayout"),
    AuthLayout: () => import("@/layouts/AuthLayout"),
    AppBar: () => import("@/layouts/partials/Auth/AppBar")
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
  max-width: 1250px !important;
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
  width: 45vw;
  max-width: 610px;
  min-height: 100vh;
  padding-top: 52px !important;
}
.right-side {
  width: 28vw;
  position: relative;
  padding: 4px 10px 10px 15px;
  .search {
    overflow: hidden;
    position: fixed;
    top: 2px;
    border-radius: 10px;
    width: 100%;
    max-width: 360px;
    height: 45px;
    max-height: 45px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-weight: 300;
    font-size: 15px;
  }
  .trending {
    overflow: hidden;
    position: fixed;
    border-radius: 10px;
    max-width: 360px;
    width: 100%;
    height: 100%;
    max-height: 90vh;
    padding: 10px 20px;
    margin-top: 52px;
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
  right: -20px;
  top: 4px;
  transform: rotate(45deg);
  background: rgb(4, 192, 67);
  padding: 0px 20px 1px 20px;
}
.theme--light .auth-main {
  padding-top: 0 !important ;

  &__container {
    border-left: 1px solid #adadad;
    border-right: 1px solid #adadad;
  }
}
.theme--dark .auth-main {
  padding-top: 0 !important ;

  &__container {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 1px solid rgba(255, 255, 255, 0.12);
  }
}
.theme--light {
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #ffffff;
  }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: #ffffff;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #505050;
  }
}
.theme--dark {
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #1f2023;
  }

  ::-webkit-scrollbar {
    width: 8px;
    background-color: #1f2023;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #4e4e4e;
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
