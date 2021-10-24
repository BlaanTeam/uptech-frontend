<template>
  <v-container class="about pt-10 d-flex flex-column align-center">
    <span>
      <h1>Hello there 👋</h1>
      <v-divider />
    </span>

    <v-divider />
    <p class="py-2 title">
      UpTech is a free open source social media website
      <br />
      That makes it easy for you to connect and share with family and friends
      online <br />
      It's a place where users can post comments, share their toughts and
      moments
      <br />
      It's light, fast and easy to use, open sourced on
      <a
        href="https://github.com/BlaanTeam/uptech"
        target="_blank"
        class="primary--text underlined"
      >
        Github
      </a>
    </p>

    <span class="mt-4">
      <h1>Made with ❤️ by</h1>
      <v-divider />
    </span>

    <v-divider />
    <v-row>
      <v-col v-for="(user, i) in founders" :key="i">
        <v-card class="bg mt-4" max-width="350">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-subtile mb-4">
                <a
                  :href="'https://up-tech.netlify.app/profile/' + user.username"
                  class="underlined"
                  target="_blank"
                >
                  @{{ user.username }}
                </a>
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ user.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ user.info }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" color="primary" class="mt-10 red">
              <span class="img">
                <img class="img" :src="user.avatar" />
              </span>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <a :href="user.twitter" target="_blank" class="ms-2">
              <v-icon color="blue">mdi-twitter</v-icon>
            </a>
            <a :href="user.github" class="ms-4" target="_blank">
              <v-icon color="white">mdi-github</v-icon>
            </a>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <span class="mt-10">
      <h1>Contributers</h1>
      <v-divider />
    </span>
    <v-row class="pb-10 pt-4">
      <v-col v-for="(user, i) in contributers" :key="i">
        <v-card class="bg mt-4" max-width="350">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-subtile mb-4">
                <a
                  :href="'https://up-tech.netlify.app/profile/' + user.username"
                  class="underlined"
                  target="_blank"
                >
                  @{{ user.username }}
                </a>
              </div>
              <v-list-item-title class="text-h5 mb-1">
                {{ user.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ user.info }}
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" color="primary" class="mt-10 red">
              <span class="img">
                <img class="img" :src="user.avatar" />
              </span>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <a :href="user.twitter" target="_blank" class="ms-2">
              <v-icon color="blue">mdi-twitter</v-icon>
            </a>
            <a :href="user.github" class="ms-4" target="_blank">
              <v-icon color="white">mdi-github</v-icon>
            </a>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "About",
  data: () => ({
    founders: [
      {
        username: "awbx",
        name: "abdelhadi sabani",
        info: "Backend developer, python monster, software engineering student",
        avatar:
          "https://pbs.twimg.com/profile_images/1436109746352836611/akOOq04B_400x400.jpg",
        twitter: "https://twitter.com/AbdelhadiSabani",
        github: "https://twitter.com/awbx"
      },
      {
        username: "oumoussa98",
        name: "Abdelouahed oumoussa",
        info: "Frontend developer, vuejs lover, software engineering student",
        avatar:
          "https://pbs.twimg.com/profile_images/1436066998396596229/YfJmCoVj_400x400.jpg",
        twitter: "https://twitter.com/oumoussa98",
        github: "https://twitter.com/oumoussa98"
      }
    ],
    contributers: [
      {
        username: "youssefelhaimer",
        name: "Youssef elhaimer",
        info: "Full-stack web developer, mobile developer",
        avatar:
          "https://pbs.twimg.com/profile_images/1380916504217141249/lD5Vcj8X_400x400.jpg",
        twitter: "https://twitter.com/youssefelhaime",
        github: "https://twitter.com/youssefelhaimer8"
      }
    ]
  })
};
</script>
<style>
.img {
  width: 74px;
  height: 74px;
  border-radius: 50%;
}
</style>
