const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

mongoose.set("useCreateIndex", true);

const postSchema = new Schema({
  postBody: {
    type: String,
    required: true,
  },
  postUser: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: false,
  },
  isPravite: {
    type: Boolean,
    required: true,
    default: false,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "likes" }],
  tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
});

const commentSchema = new Schema({
  commentBody: {
    type: String,
    required: true,
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  createAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});
const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
});
const tagSchema = new Schema({
  tagName: {
    type: String,
    required: true,
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "users" },
});

module.exports = {
  Post: Model("posts", postSchema),
  Comment: Model("comments", commentSchema),
  Like: Model("likes", likeSchema),
  Tag: Model("tags", tagSchema),
};
