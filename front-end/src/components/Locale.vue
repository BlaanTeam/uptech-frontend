<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn class="mr-3 text-center" text v-bind="attrs" v-on="on">
        <v-icon>mdi-translate</v-icon>
        <v-icon small>mdi-chevron-down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        dense
        class="text-center py-0 "
        link
        @click="setLocale('en')"
      >
        <v-list-item-title>{{ $t("langs.en") }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        dense
        class="text-center py-0 "
        link
        @click="setLocale('ar')"
      >
        <v-list-item-title>{{ $t("langs.ar") }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  data: () => ({
    locale: "en",
    locales: [
      { title: "English", shortcut: "en" },
      { title: "Darija", shortcut: "ar" }
    ]
  }),

  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale;
      localStorage.setItem("locale", locale);
      if (locale === "ar") {
        this.$vuetify.rtl = true;
      } else this.$vuetify.rtl = false;
      // TODO: auto reload after locale changing
    }
  },
  beforeCreate() {
    this.locale = localStorage.getItem("locale");
    if (this.locale === "ar") {
      this.$vuetify.rtl = true;
    }
    this.$i18n.locale = this.locale;
  }
};
</script>
