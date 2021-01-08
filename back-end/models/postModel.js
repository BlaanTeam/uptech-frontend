const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

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
  isPrivate: {
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
  commentUser: { type: Schema.Types.ObjectId, ref: "users" },
  postId: { type: Schema.Types.ObjectId, ref: "posts" },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});
const likeSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  postId: { type: Schema.Types.ObjectId, ref: "posts" },
});
const tagSchema = new Schema({
  tagName: {
    type: String,
    required: true,
    trim: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  postId: { type: Schema.Types.ObjectId, ref: "posts" },
});

postSchema.methods.isLikedByUser = async function (userId) {
  let post = await this.populate({
    path: "likes",
    match: {
      user: userId,
    },
  }).execPopulate();
  return post.likes.length === 1 ? true : false;
};

module.exports = {
  Post: Model("posts", postSchema),
  Comment: Model("comments", commentSchema),
  Like: Model("likes", likeSchema),
  Tag: Model("tags", tagSchema),
};
