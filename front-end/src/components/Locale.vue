<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="me-3 text-center" text v-bind="attrs" v-on="on">
        <v-icon>mdi-translate</v-icon>
        <v-icon small>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list class="lang" dense>
      <v-list-item class="text-center" link @click="setLocale('en')">
        <v-list-item-title>{{ $t("langs.en") }}</v-list-item-title>
      </v-list-item>
      <v-list-item dense class="text-center" link @click="setLocale('ar')">
        <v-list-item-title>{{ $t("langs.ar") }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    locale: "en"
  }),

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
  }
};
</script>
