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
            <keep-alive :max="4" :include="includes">
              <router-view class="router-view"></router-view>
            </keep-alive>
          </div>
          <v-divider vertical />
          <div class="right-side">
            <div class="trending secondarybg"></div>
            <div class="search secondarybg"></div>
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
.v-application--wrap {
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
  }
  .trending {
    position: fixed;
    border-radius: 10px;
    max-width: 380px;
    width: 100%;
    height: 100%;
    max-height: 90vh;
  }
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
