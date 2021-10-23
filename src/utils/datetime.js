import Vue from "vue";
export default function dateTimeFormat(time) {
  const date = new Date(time).toLocaleDateString();
  const hours = new Date(time).getHours();
  const minutes = new Date(time).getMinutes();
  return `${date} ${hours}:${minutes}`;
}

Vue.mixin({
  methods: {
    dateTimeFormat
  }
});
