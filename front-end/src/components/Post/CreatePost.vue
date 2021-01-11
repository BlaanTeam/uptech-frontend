<template>
  <v-card class="create__post my-10 auth-secondarybg">
    <v-card-title class="ma-0 d-inline-block float-left">
      <v-avatar width="40" color="green">
        <span class="white--text caption">
          test
        </span>
      </v-avatar>
    </v-card-title>
    <v-card-subtitle class="ms-10 ps-4 pt-3 d-block">
      <v-textarea
        id="CreateTextArea"
        placeholder="What's on your mind"
        label=""
        auto-grow
        rows="1"
        :append-outer-icon="content.value.length > 1 ? 'mdi-close' : ''"
        @click:append-outer="clearTextArea"
        row-height="10"
        counter="5000"
        v-model="content.value"
      ></v-textarea>
    </v-card-subtitle>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            elevation="0"
            class="ms-4 me-2 options"
            @click="isPrivate = !isPrivate"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon v-if="!isPrivate" size="20" color="info">
              mdi-earth
            </v-icon>
            <v-icon v-else size="20" color="#05bd58">mdi-lock</v-icon>
          </v-btn>
        </template>
        <span>{{ togglePrivatePublic }}</span>
      </v-tooltip>

      <Emojis
        attach=".create__post"
        :inputModel="content"
        element="CreateTextArea"
      />
      <v-btn
        :disabled="content.value && content.value.length < 2"
        @click="createPost"
        class="ms-auto primary"
        elevation="0"
      >
        Post
        <v-icon right>mdi-send</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Emojis from "@/components/Emojis";

export default {
  components: { Emojis },
  data: () => ({
    content: { value: "" },
    isPrivate: false,
    loading: { value: false }
  }),
  computed: {
    togglePrivatePublic() {
      return this.isPrivate ? "private" : "public";
    }
  },
  methods: {
    clearTextArea() {
      this.content.value = "";
    },
    async createPost() {
      if (this.content.value.trim().length < 2) return;

      let temptext = this.content.value;
      this.content.value = "";
      this.loading.value = true;
      this.$emit("creating", this.loading);

      try {
        const res = await this.$store.dispatch("createPost", {
          content: temptext,
          isPrivate: this.isPrivate
        });
        if (res.status === 201) {
          console.log("Post Created");
          temptext = "";
          this.loading.value = false;
        }
      } catch (err) {
        this.content.value = temptext;
        this.loading.value = false;

        console.log(err);
      }
    }
  }
};
</script>

<style lang="scss">
.create__post {
  .v-input__slot::before {
    content: unset !important;
  }
  // .v-input__slot::after {
  //   content: unset !important;
  //
  .options {
    position: relative !important;
  }
  .menu-list {
    position: absolute !important;
  }
  .container-emoji {
    height: 280px !important;
  }
}
</style>
