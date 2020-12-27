<template>
  <div>
    <notifications :duration="10000" position="bottom right" group="errors">
    </notifications>
    <notifications :duration="10000" position="bottom left" group="success">
    </notifications>

    <UnAuthLayout v-if="!$store.getters.isLoggedIn" :style="background">
      <v-main>
        <router-view></router-view>
      </v-main>
    </UnAuthLayout>

    <AuthLayout v-else :style="background">
      <v-main>
        <router-view :key="$route.fullPath"></router-view>
      </v-main>
    </AuthLayout>
  </div>
</template>

<script>
import UnAuthLayout from "./layouts/UnAuthLayout";
import AuthLayout from "@/layouts/AuthLayout";

export default {
  data: () => ({
    locale: "en"
  }),
  name: "App",
  components: {
    UnAuthLayout,
    AuthLayout
  },
  beforeCreate() {
    this.locale = localStorage.getItem("locale");
    if (this.locale === "ar") {
      this.$vuetify.rtl = true;
    } else {
      this.$vuetify.rtl = false;
    }
    this.$i18n.locale = this.locale;
    this.$timeago.locale = this.locale;
  },
  computed: {
    background() {
      return { background: this.$vuetify.theme.currentTheme.bg };
    }
  },
  watch: {
    "$i18n.locale"(newV, oldV) {
      document.title = `${this.$t("appName")} | ${this.$t(
        this.$route.meta.title
      )}`;
    },
    "$store.getters.isLoggedIn"(newV, oldV) {
      if (this.$vuetify.theme.isDark === false) {
        let bg = this.$vuetify.theme.currentTheme.bg;
        this.$vuetify.theme.currentTheme.bg = this.$vuetify.theme.currentTheme.secondarybg;
        this.$vuetify.theme.currentTheme.secondarybg = bg;
      }
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
</style>
