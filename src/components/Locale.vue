<template>
  <div>
    <v-menu nudge-left="5" offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="text-center"
          text
          height="30"
          width="36"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-translate</v-icon>
          <v-icon small>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
      <v-list class="lang auth-secondarybg pa-0 ma-0" dense>
        <v-list-item class="text-center" link @click="setLocale('en')">
          <v-list-item-title>{{ $t("langs.en") }}</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item class="text-center" link @click="setLocale('ar')">
          <v-list-item-title>{{ $t("langs.ar") }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    locale: "en"
  }),
  inheritAttrs: false,

  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
      this.$timeago.locale = locale;
      localStorage.setItem("locale", locale);
      if (locale === "ar") {
        this.$vuetify.rtl = true;
      } else {
        this.$vuetify.rtl = false;
      }
      // TODO: auto reload after locale changing
    }
  },
  created() {
    let locale = localStorage.getItem("locale");
    this.$i18n.locale = locale;
    this.$timeago.locale = locale;
    if (locale === "ar") {
      this.$vuetify.rtl = true;
    } else {
      this.$vuetify.rtl = false;
    }
  }
};
</script>
