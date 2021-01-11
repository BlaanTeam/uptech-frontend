<template>
  <v-footer color="bg footer lighten-1">
    <v-row>
      <v-col class="mx-10 socials">
        <h2 class="ml-4 primary--text">Get connected on</h2>
        <div class="ml-6 buttons">
          <v-btn
            v-for="(social, i) in socials"
            :key="social + i"
            icon
            class="ml-2 mt-10 pa-1"
          >
            <v-icon size="30">mdi-{{ social.name }}</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col>
        <h2 class="ml-1 primary--text">Other links</h2>
        <v-list-item
          v-for="(link, i) in links"
          :key="link + i"
          dense
          class="ma-0"
        >
          <v-list-item-content>
            <v-list-item-title>{{ link }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col>
        <h2 class="ml-4 primary--text">Support</h2>
        <router-link to="#" v-for="(support, i) in supports" :key="support + i">
          <v-list-item dense class="ma-0">
            <v-list-item-content>
              <v-list-item-title>{{ support }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </router-link>
      </v-col>
    </v-row>
  </v-footer>
</template>
<script>
export default {
  data: () => ({
    links: ["Home", "About Us", "Meet the team"],
    supports: ["Contact Us", "Policies", "privacy"],

    socials: [{ name: "facebook" }, { name: "twitter" }, { name: "instagram" }]
  })
};
</script>
<style lang="scss">
.footer {
  z-index: 2;
}
// @media screen and (max-width: 700px) {
//   .footer {
//     .socials {
//       margin: 0;
//       padding: 0;
//       display: block;
//       background: red;
//       width: 100%;
//     }
//   }
// }
</style>
