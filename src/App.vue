<template>
  <div>
    <notifications :duration="10000" position="bottom right" group="errors" />
    <notifications :duration="10000" position="bottom left" group="success" />

    <UnAuthLayout v-if="!loggedIn" :style="unAuthBackground">
      <v-main class="main">
        <router-view></router-view>
      </v-main>
    </UnAuthLayout>

    <AuthLayout v-else :style="authBackground">
      <v-main class="auth-main pt-0">
        <div :class="{ 'd-flex': !chatRoute }">
          <div class="auth-main__container">
            <AppBar v-show="!chatRoute" />
            <router-view
              :class="{ 'router-view': !chatRoute, 'chat-view': chatRoute }"
            />
          </div>
          <div v-show="!chatRoute" class="right-side">
            <Search />
            <div class="trends-and-suggestions">
              <Trends />
              <UsersSuggestion />
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
    AppBar: () => import("@/layouts/partials/Auth/AppBar"),
    Trends: () => import("@/components/Trends/Trends"),
    Search: () => import("@/components/Search/Search"),
    UsersSuggestion: () => import("@/components/Suggestions/UsersSuggestion")
  },
  data: () => ({
    includes: ["Profile"]
  }),
  computed: {
    unAuthBackground() {
      return { background: this.$theme.currentTheme.bg };
    },
    authBackground() {
      return { background: this.$theme.currentTheme["auth-bg"] };
    },
    chatRoute() {
      return this.$route.path.startsWith("/messages");
    },
    loggedIn() {
      return this.$store.getters.isLoggedIn;
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
.app-width {
  max-width: 1250px !important;
  margin: 0 auto !important;
}
.auth-layout .v-application--wrap {
  max-width: 1250px !important;
  margin: 0 auto !important;
}
.theme--light {
  .auth-main__container {
    border-left: 1px solid #adadad;
    border-right: 1px solid #adadad;
    @media screen and (max-width: 800px) {
      border-left: unset;
      border-right: unset;
    }
  }
  .chat-view {
    border-right: 1px solid #adadad;
  }
}
.theme--dark {
  .auth-main__container {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
    border-right: 1px solid rgba(255, 255, 255, 0.12);
    @media screen and (max-width: 800px) {
      border-left: unset;
      border-right: unset;
    }
  }
  .chat-view {
    border-right: 1px solid rgba(255, 255, 255, 0.12);
  }
}
main {
  min-height: 100vh;
  width: 100%;
}

.router-view {
  width: 45vw;
  max-width: 610px;
  min-height: 100vh;
  padding-top: 52px !important;
  @media screen and (max-width: 800px) {
    width: 100vw;
  }
}
.chat-view {
  width: 80vw !important;
  max-width: 1000px !important;
  min-height: 100vh;
  @media screen and (max-width: 800px) {
    width: 100vw !important;
    max-width: 100vw !important;
  }
}

.right-side {
  width: 28vw;
  position: relative;
  padding: 4px 10px 10px 15px;
  .trends-and-suggestions {
    position: fixed;
    max-width: 360px;
    width: 100%;
    height: 100%;
    margin-top: 52px;
    display: flex;
    flex-direction: column;
    max-height: 590px;
  }
  @media screen and (max-width: 800px) {
    display: none;
  }
}
.v-application a {
  color: inherit !important;
}
a {
  text-decoration: none;
  color: white;
}
.vue-notification-group {
  font-family: Roboto, sans-serif;
  width: 320px !important;
  line-height: 16px !important;
  .notification-content {
    font-size: 14px !important;
  }
  .warn {
    background: #e09c36 !important;
    border-left-color: #f8bb71 !important;
  }

  .error {
    background: #c9392f !important;
    border-left-color: #e77e77 !important;
  }

  .success {
    background: #03ad4d !important;
    border-left-color: #6af1a7 !important;
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
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
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
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px #343538 inset !important;
  }
  input:-webkit-autofill {
    -webkit-text-fill-color: white !important;
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
