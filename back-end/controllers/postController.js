const { createError } = require("../utils/globals");
const { Post, Comment, Like, Tag } = require("../models/postModel");
const {
  postSchema,
  postIdSchema,
  feedPostsSchema,
} = require("../utils/validationSchema");

// This function will handle retrieving feed posts process
const feedPosts = async (req, res, next) => {
  try {
    // let totalPages = await Post.countDocuments();
    let result = await feedPostsSchema.validateAsync(req.query);
    // TODO : add per page options
    // const perPage = 50
    // const page = Math.max(0,result.page)
    let posts = await Post.find({ isPrivate: false }, { __v: 0 })
      .skip(result.offset)
      .limit(result.limit)
      .sort("-createdAt")
      .populate({
        path: "postUser",
        select: "userName profile",
      });
    res.json(posts);
  } catch (err) {
    if (err.isJoi) {
      err.status = 400;
    }
    next(err);
  }
};

// This function will handle the creating posts process
createPost = async (req, res, next) => {
  try {
    let result = await postSchema.validateAsync(req.body);
    let newPost = new Post({
      postBody: result.postBody,
      postUser: req.currentUser._id,
      isPrivate: result.isPrivate,
    });
    await newPost.save();
    await newPost
      .populate({
        path: "postUser",
        select: "userName profile",
      })
      .execPopulate();
    res.status(201);
    res.json(newPost);
  } catch (err) {
    next(err);
  }
};
// This function will handle the retrieving post process

const retrievePost = async (req, res, next) => {
  try {
    let result = await postIdSchema.validateAsync(req.params);
    let post = await Post.findOne({ _id: result.postId }, { __v: 0 }).populate({
      path: "postUser",
      select: "userName profile",
    });

    if (!post) throw new createError("Post Not Found", 1021, 404);
    res.json(post);
  } catch (err) {
    if (err.isJoi === true)
      err = new createError("Post Not Found !", 1021, 404);
    next(err);
  }
};

// This function will handle deleting post process

const deletePost = async (req, res, next) => {
  try {
    let result = await postIdSchema.validateAsync(req.params);
    let post = await Post.findOne({ _id: result.postId }, { __v: 0 }).populate({
      path: "postUser",
      select: "userName profile",
    });
    if (!post) throw new createError("Post Not Found !", 1021, 404);
    else if (post.postUser._id.toString() !== req.currentUser._id.toString()) {
      throw new createError("You don't have permission !", 1003, 403);
    }
    await post.remove();
    res.status(204);
    res.end();
  } catch (err) {
    if (err.isJoi === true)
      err = new createError("Post Not Found !", 1021, 404);
    next(err);
  }
};

// This function will handle updating post process

const updatePost = async (req, res, next) => {
  try {
    let result_x = await postIdSchema.validateAsync(req.params);
    let result_y = await postSchema.validateAsync(req.body);
    let post = await Post.findOne(
      { _id: result_x.postId },
      { __v: 0 }
    ).populate({
      path: "postUser",
      select: "userName profile",
    });
    if (!post) throw new createError("Post Not Found !", 1021, 404);
    else if (post.postUser._id.toString() !== req.currentUser._id.toString()) {
      throw new createError("You don't have permission !", 1003, 403);
    }
    // update documments
    post.postBody = result_y.postBody;
    post.isPrivate = result_y.isPrivate;
    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    if (err.isJoi === true) {
      err.status = 400;
      err.code = 1049;
    }
    next(err);
  }
};

module.exports = {
  feedPosts,
  createPost,
  retrievePost,
  deletePost,
  updatePost,
};
