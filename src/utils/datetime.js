import Vue from "vue";
export default function dateTimeFormat(time) {
  const date = new Date(time).toLocaleDateString();
  let hours = new Date(time).getHours().toString();
  if (hours.length == 1) hours = "0" + hours;
  let minutes = new Date(time).getMinutes().toString();
  if (minutes.length == 1) minutes = "0" + minutes;

  return `${date} ${hours}:${minutes}`;
}

Vue.mixin({
  methods: {
    dateTimeFormat
  }
});
