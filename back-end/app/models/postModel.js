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
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "comments" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "likes" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "tags" }],
});

postSchema.index({
    _id: 1,
    user: 1,
    createdAt: -1,
    isPrivate: 1,
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
    user: { type: Schema.Types.ObjectId, ref: "users" },
    postId: { type: Schema.Types.ObjectId, ref: "posts" },
});

commentSchema.index({
    createdAt: -1,
    user: 1,
    postId: 1,
});
const likeSchema = new Schema({
    liked: {
        type: Boolean,
        default: false,
    },
    user: { type: Schema.Types.ObjectId, ref: "users" },
    postId: { type: Schema.Types.ObjectId, ref: "posts" },
});

likeSchema.index({
    user: 1,
    postId: 1,
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
