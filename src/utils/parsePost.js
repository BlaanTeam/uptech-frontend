import { encode } from "html-entities";
import pattern from "../store/patterns";
export default function(content) {
  this.text = content;
  this.parseMention = function() {
    this.text = this.text.replace(pattern.mentionRegex, value => {
      return `<a href="#/profile/${value
        .replace("@", "")
        .trim()}">${value}</a>`;
    });
  };
  this.parseLink = function() {
    this.text = this.text.replace(pattern.linkRegex, value => {
      return `<a href="#/redirect?link=${value}" >${value}</a>`;
    });
  };
  this.parseTag = function() {
    this.text = this.text.replace(pattern.tagRegex, value => {
      return `<a href="#/search?tag=${value
        .replace("#", "")
        .trim()}">${value}</a>`;
    });
  };
  this.convertTags = function() {
    this.text = encode(this.text);
  };

  this.convertTags();
  this.parseMention();
  this.parseLink();
  this.parseTag();

  return this.text;
}
