<template>
  <v-menu
    v-bind="$attrs"
    :close-on-content-click="false"
    offset-y
    :attach="attach"
    transition="slide-y-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        icon
        class="mx-1 float-right"
        color="white"
      >
        😀
      </v-btn>
    </template>

    <VEmojiPicker :dark="$vuetify.theme.isDark" @select="selectEmoji" />
  </v-menu>
</template>

<script>
export default {
  props: {
    attach: { default: false },
    element: { type: String, required: true },
    inputModel: { type: Object, required: true }
  },
  data: () => ({
    selectionStart: null,
    selected: false
  }),
  methods: {
    selectEmoji(emoji) {
      let el = document.getElementById(this.element);

      el.onclick = () => {
        this.selected = true;
      };

      if (this.selected) this.selectionStart = el.selectionStart;
      else if (!this.selected && this.selectionStart === null)
        this.selectionStart = el.selectionStart;

      this.inputModel.value =
        this.inputModel.value.substring(0, el.selectionStart) +
        this.inputModel.value.substring(el.selectionEnd);

      let before = this.inputModel.value.substring(0, this.selectionStart);
      let after = this.inputModel.value.substring(this.selectionStart);

      this.inputModel.value = before + emoji.data + after;
      this.selectionStart += 2;

      this.selected = false;
    }
  }
};
</script>

<style></style>
