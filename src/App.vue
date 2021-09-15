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

    <AuthLayout v-else :style="authBackground">
      <v-main>
        <keep-alive :max="5">
          <router-view></router-view>
        </keep-alive>
      </v-main>
    </AuthLayout>
  </div>
</template>

<script>
import UnAuthLayout from "./layouts/UnAuthLayout";
import AuthLayout from "@/layouts/AuthLayout";

export default {
  components: {
    UnAuthLayout,
    AuthLayout
  },
  data: () => ({
    includes: ["CreatePost", "Profile"]
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
a {
  text-decoration: none;
  color: white;
}
main {
  min-height: 100vh;
}
.v-application a {
  color: inherit !important;
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
