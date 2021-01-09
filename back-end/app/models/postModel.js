const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false,
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "likes" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
});

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    postId: { type: Schema.Types.ObjectId, ref: "posts" },
});
const likeSchema = new Schema({
    liked: {
        type: Boolean,
        default: false,
    },
    userId: { type: Schema.Types.ObjectId, ref: "users" },
    postId: { type: Schema.Types.ObjectId, ref: "posts" },
});
const tagSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    count: {
        type: Number,
    },
});

tagSchema.index(
    {
        name: 1,
    },
    { unique: true }
);
module.exports = {
    Post: Model("posts", postSchema),
    Comment: Model("comments", commentSchema),
    Like: Model("likes", likeSchema),
    Tag: Model("tags", tagSchema),
};
