<template>
  <div class="conversations bg">
    <div class="d-flex py-3 px-2">
      <img src="@/assets/images/avatar.svg" width="40" />
      <h1 class="ms-4 ">Chats</h1>
      <div class="ms-auto me-4 align-self-center">
        <v-btn icon>
          <v-icon size="25">mdi-cog</v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-list class="bg" height="80%">
      <v-list-item-group dense>
        <div v-for="(item, i) in conversations" :key="i">
          <router-link :to="{ path: '/messages/' + i }">
            <v-list-item class="py-1">
              <v-list-item-avatar width="40" height="40">
                <v-img :src="item.avatar"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="mb-1">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="pa-0 ma-0">
                  <span>
                    {{ item.subtitle.slice(0, 30) + "..." }}
                  </span>
                  <span class="float-right">14h</span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </router-link>
          <v-divider></v-divider>
        </div>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: "Conversations",
  data: () => ({}),
  props: {
    conversations: { type: Array, required: true }
  },
  mounted() {
    console.log("hello from conversation");
  }
};
</script>

<style></style>
