<template>
  <v-container class="about pt-10 d-flex flex-column align-center">
    <span>
      <h1>Hello there 👋</h1>
      <v-divider />
    </span>

    <v-divider />
    <p class="py-2 title">
      UpTech is a free open source social media website <br />
      that makes it easy for you to connect and share with family and friends
      online <br />
      it's a place where users can post comments, share their tought and moments
      <br />
      light, fast and easy to use
    </p>

    <span class="mt-4">
      <h1>Made with ❤️ by</h1>
      <v-divider />
    </span>

    <v-divider />
    <v-row>
      <v-col>
        <v-card class="bg mt-2" max-width="350">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-subtile mb-4">
                <a
                  href="https://up-tech.netlify.app/profile/awbx"
                  class="underlined"
                  target="_blank"
                >
                  @awbx
                </a>
              </div>
              <v-list-item-title class="text-h5 mb-1">
                Abdelhadi sabani
              </v-list-item-title>
              <v-list-item-subtitle>
                Backend developer, software engineering student
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" color="primary" class="mt-10 red">
              <span class="img">
                <img
                  class="img"
                  src="https://pbs.twimg.com/profile_images/1436109746352836611/akOOq04B_400x400.jpg"
                />
              </span>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <a
              href="https://twitter.com/AbdelhadiSabani"
              target="_blank"
              class="ms-2"
            >
              <v-icon color="blue">mdi-twitter</v-icon>
            </a>
            <a href="https://github.com/awbx" class="ms-4" target="_blank">
              <v-icon color="white">mdi-github</v-icon>
            </a>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col>
        <v-card class="bg mt-2" max-width="350">
          <v-list-item three-line>
            <v-list-item-content>
              <div class="text-subtile mb-4">
                <a
                  href="https://up-tech.netlify.app/profile/oumoussa98"
                  class="underlined"
                >
                  @oumoussa98
                </a>
              </div>
              <v-list-item-title class="text-h5 mb-1">
                Abdelouahed oumoussa
              </v-list-item-title>
              <v-list-item-subtitle>
                frontend developer, software engineering student
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80" color="primary" class="mt-10 red">
              <span class="img">
                <img
                  class="img"
                  src="https://pbs.twimg.com/profile_images/1436066998396596229/YfJmCoVj_400x400.jpg"
                />
              </span>
            </v-list-item-avatar>
          </v-list-item>

          <v-card-actions>
            <a href="https://twitter.com/oumoussa98" class="ms-2">
              <v-icon color="blue">mdi-twitter</v-icon>
            </a>
            <a href="https://github.com/oumoussa98" class="ms-4">
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
  </v-container>
</template>

<script>
export default {
  name: "About"
};
</script>
<style>
.img {
  width: 74px;
  height: 74px;
  border-radius: 50%;
}
</style>
