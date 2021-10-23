import Vue from "vue";
const patterns = {
  objectId: /^[a-fA-F0-9]{24}$/,
  username: /^[a-z0-9_-]{4,16}$/,
  password: /(?=.{4,16})/,
  email: /^([a-z0-9_.+-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/,
  bio: /[\s\S]{2,100}$/,
  jwtToken: /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
  linkRegex: new RegExp(
    /(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
    "gi"
  ),
  tagRegex: new RegExp(/\#\w+/, "gi"),
  mentionRegex: new RegExp(/\B\@([\w\_\-]+)/, "gi")
};

Vue.prototype.$pattern = patterns;
export default patterns;
