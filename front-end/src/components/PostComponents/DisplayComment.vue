<template>
  <div :class="'display-comments py-2 comment' + comment.id">
    <v-row class="ms-10" no-gutters>
      <v-col cols="1" class="">
        <v-avatar width="20" color="green">
          <span class="white--text headline">me</span>
        </v-avatar>
      </v-col>
      <v-col cols="9" class="auth-bg rounded-lg ps-3 pe-2 mx-1">
        <v-row v-if="edit" no-gutters>
          <v-col>
            <v-textarea
              ref="EditTextArea"
              autofocus
              label=""
              auto-grow
              :rows="1"
              append-outer-icon="mdi-send"
              @click:append-outer="() => {}"
              v-model="commentBody"
            ></v-textarea>
          </v-col>
          <v-col cols="1">
            <v-menu
              :close-on-content-click="false"
              right
              transition="slide-y-transition"
              nudge-left="320"
              nudge-top="350"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  icon
                  elevation="0"
                  class="mx-1 emoji-btn"
                >
                  😀
                </v-btn>
              </template>
              <VEmojiPicker
                :dark="$vuetify.theme.isDark"
                @select="selectEmoji"
              />
            </v-menu>
          </v-col>
        </v-row>

        <p v-else class="mt-3">{{ comment.commentBody }}</p>
      </v-col>
      <v-col cols="1" class="align-self-center">
        <v-menu
          :attach="'.comment' + comment.id"
          nudge-right="25"
          offset-y
          left
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="auth-secondarybg"
              elevation="0"
              icon
            >
              <v-icon size="40">mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list-item-group class="auth-secondarybg">
            <v-list-item dense>
              <v-icon left small>mdi-reply</v-icon>
              <v-list-item-title>reply</v-list-item-title>
            </v-list-item>
            <v-list-item dense @click="edit = true">
              <v-icon left small>mdi-square-edit-outline</v-icon>
              <v-list-item-title>edit</v-list-item-title>
            </v-list-item>
            <v-list-item dense>
              <v-icon left small color="red">mdi-delete</v-icon>
              <v-list-item-title class="red--text">delete</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data: props => ({
    edit: false,
    commentBody: props.comment
  })
};
</script>

<style></style>
