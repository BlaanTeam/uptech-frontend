<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
      open-on-hover
    >
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on">
          <slot></slot>
        </span>
      </template>

      <v-card>
        <v-list class="secondarybg">
          <v-list-item>
            <v-list-item-avatar>
              <img src="@/assets/images/avatar.svg" alt="avatar" width="30" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>John doe</v-list-item-title>
              <v-list-item-subtitle>some info</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-list class="secondarybg">
          <v-list-item>
            <v-list-item-title>Some other info</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
export default {
  data: () => ({
    fav: true,
    menu: false,
    message: false,
    hints: true
  })
};
</script>

<style></style>
