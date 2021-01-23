const { createError: cE } = require("../utils/globals");
const createError = require("http-errors");
const { Post, Comment, Like, Tag } = require("../models/postModel");
const { Follow } = require("../models/authModel");
const {
    postValidator,
    commentValidator,
} = require("../utils/validationSchema");

// This function will handle retrieving feed posts process
const getFeedPosts = async (req, res, next) => {
    try {
        let query = await postValidator(req.query, { createdAt: 2 });
        let perPage = 20;
        let following = await Follow.find({
            userOne: req.currentUser._id,
            status: 2,
        }).distinct("userTwo");
        following.push(req.currentUser._id);
        let matchQuery = {};
        if (query.createdAt) {
            matchQuery = {
                $expr: {
                    $and: [
                        {
                            $lt: ["$createdAt", query.createdAt],
                        },
                        {
                            $eq: ["$isPrivate", false],
                        },
                        {
                            $in: ["$user", following],
                        },
                    ],
                },
            };
        } else {
            matchQuery = {
                $expr: {
                    $and: [
                        {
                            $eq: ["$isPrivate", false],
                        },
                        {
                            $in: ["$user", following],
                        },
                    ],
                },
            };
        }
        let posts = await Post.aggregate([
            {
                $match: matchQuery,
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
            {
                $facet: {
                    posts: [
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$user" },
                                as: "user",
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$userId"],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            userName: 1,
                                            profile: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        { $unwind: "$user" },
                        {
                            $lookup: {
                                from: "likes",
                                let: {
                                    postId: "$_id",
                                    userId: req.currentUser._id,
                                },
                                as: "like",
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            "$user",
                                                            "$$userId",
                                                        ],
                                                    },
                                                    {
                                                        $eq: [
                                                            "$postId",
                                                            "$$postId",
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            liked: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $unwind: {
                                path: "$like",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $addFields: {
                                likedByViewer: {
                                    $cond: [
                                        {
                                            $eq: ["$like.liked", true],
                                        },
                                        true,
                                        false,
                                    ],
                                },
                                comments: { $size: "$comments" },
                                likes: { $size: "$likes" },
                            },
                        },
                        { $limit: perPage },
                        {
                            $project: {
                                __v: 0,
                                tags: 0,
                                like: 0,
                            },
                        },
                    ],
                },
            },
        ]);
        posts = posts[0];
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

// This function will handle the creating posts process
const addPost = async (req, res, next) => {
    try {
        let data = await postValidator(req.body, { content: 1, isPrivate: 2 });
        let newPost = new Post({
            content: data.content,
            user: req.currentUser._id,
            isPrivate: data.isPrivate,
        });
        await newPost.save();
        await newPost
            .populate({
                path: "user",
                select: "userName profile",
            })
            .execPopulate();
        newPost._doc.isOwner =
            req.currentUser._id.toString() === newPost.user._id.toString()
                ? true
                : false;
        res.status(201);
        res.json(newPost);
    } catch (err) {
        next(err);
    }
};
// This function will handle the retrieving post process

const getPost = async (req, res, next) => {
    try {
        let params = await postValidator(req.params, { postId: 1 });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $set: {
                    isOwner: {
                        $cond: [
                            { $eq: ["$user", req.currentUser._id] },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    as: "user",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
                                },
                            },
                        },
                        {
                            $project: {
                                userName: 1,
                                profile: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $lookup: {
                    from: "likes",
                    let: {
                        postId: "$_id",
                    },
                    as: "like",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postId", "$$postId"] },
                                        { $eq: ["$user", req.currentUser._id] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                liked: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$like",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$user._id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userOne"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userTwo"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$user._id",
                        userTwo: req.currentUser._id,
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userOne"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userTwo"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: "followTwo",
                },
            },
            {
                $unwind: {
                    path: "$followOne",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$followTwo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    blockedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    followedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 2],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    rejectedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 3],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    requestedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 1],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    followsViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 2],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasBlockedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasRequestedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 1],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasRejectedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 3],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    likedByViewer: {
                        $cond: [{ $eq: ["$like.liked", true] }, true, false],
                    },
                    comments: { $size: "$comments" },
                    likes: { $size: "$likes" },
                },
            },
            {
                $project: {
                    __v: 0,
                    like: 0,
                    tags: 0,
                    followOne: 0,
                    followTwo: 0,
                },
            },
        ]);
        post = post[0];
        if (!post) {
            throw createError.NotFound();
        } else if (post.blockedByViewer || post.hasBlockedViewer) {
            throw createError.NotFound();
        } else if (post.isPrivate === true && !post.isOwner) {
            throw createError.NotFound();
        }
        res.json(post);
    } catch (err) {
        next(err);
    }
};

// This function will handle deleting post process

const deletePost = async (req, res, next) => {
    try {
        let params = await postValidator(req.params, { postId: 1 });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $set: {
                    isOwner: {
                        $cond: [
                            { $eq: ["$user", req.currentUser._id] },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $project: {
                    isPrivate: 1,
                    isOwner: 1,
                },
            },
        ]);
        post = post[0];
        if (!post) {
            throw createError.NotFound();
        } else if (!post.isOwner) {
            throw createError.Forbidden();
        } else if (post.isPrivate && !post.isOwner) {
            throw createError.Forbidden();
        }
        await Post.findOneAndRemove({
            _id: post._id,
        });
        res.status(204);
        res.end();
    } catch (err) {
        next(err);
    }
};

// This function will handle updating post process

const updatePost = async (req, res, next) => {
    try {
        let params = await postValidator(req.params, { postId: 1 });
        let data = await postValidator(req.body, { content: 1, isPrivate: 2 });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $set: {
                    isOwner: {
                        $cond: [
                            { $eq: ["$user", req.currentUser._id] },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    isOwner: 1,
                },
            },
        ]);
        post = post[0];
        if (!post) {
            throw createError.NotFound();
        } else if (!post.isOwner) {
            throw createError.Forbidden();
        }
        let updatedPost = await Post.findOneAndUpdate(
            {
                _id: post._id,
            },
            {
                content: data.content,
                isPrivate: data.isPrivate,
                updatedAt: Date.now(),
            },
            {
                projection: {
                    likes: 0,
                    tags: 0,
                    comments: 0,
                    __v: 0,
                },
            }
        ).populate({
            path: "user",
            select: "userName profile",
        });
        res.json(updatedPost);
    } catch (err) {
        next(err);
    }
};

// This function will handle getting comments process

const getComments = async (req, res, next) => {
    try {
        let params = await commentValidator(req.params, {
            postId: 1,
        });
        let query = await commentValidator(req.query, { page: 2 });
        let perPage = 10;
        let pageNumber = query.page;
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $set: {
                    isOwner: {
                        $cond: [
                            { $eq: ["$user", req.currentUser._id] },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { postId: "$_id" },
                    as: "comments",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$postId", "$$postId"],
                                },
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        {
                            $lookup: {
                                from: "users",
                                let: {
                                    userId: "$user",
                                },
                                as: "user",
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: ["$_id", "$$userId"],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            userName: 1,
                                            profile: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        { $unwind: "$user" },
                        {
                            $lookup: {
                                from: "follows",
                                let: {
                                    userOne: req.currentUser._id,
                                    userTwo: "$user._id",
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            "$userOne",
                                                            "$$userOne",
                                                        ],
                                                    },
                                                    {
                                                        $eq: [
                                                            "$userTwo",
                                                            "$$userTwo",
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            status: 1,
                                        },
                                    },
                                ],
                                as: "followOne",
                            },
                        },
                        {
                            $lookup: {
                                from: "follows",
                                let: {
                                    userOne: "$user._id",
                                    userTwo: req.currentUser._id,
                                },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    {
                                                        $eq: [
                                                            "$userOne",
                                                            "$$userOne",
                                                        ],
                                                    },
                                                    {
                                                        $eq: [
                                                            "$userTwo",
                                                            "$$userTwo",
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $project: {
                                            status: 1,
                                        },
                                    },
                                ],
                                as: "followTwo",
                            },
                        },
                        {
                            $unwind: {
                                path: "$followOne",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $unwind: {
                                path: "$followTwo",
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $ne: ["$followOne.status", 4],
                                        },

                                        {
                                            $ne: ["$followTwo.status", 4],
                                        },
                                    ],
                                },
                            },
                        },

                        { $skip: (pageNumber - 1) * perPage },
                        {
                            $limit: perPage,
                        },
                        {
                            $project: {
                                __v: 0,
                                followOne: 0,
                                followTwo: 0,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$user",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userOne"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userTwo"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$user",
                        userTwo: req.currentUser._id,
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userOne"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userTwo"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                status: 1,
                            },
                        },
                    ],
                    as: "followTwo",
                },
            },
            {
                $unwind: {
                    path: "$followOne",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$followTwo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    blockedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    followedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 2],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    rejectedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 3],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    requestedByViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 1],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    followsViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 2],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasBlockedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasRequestedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followTwo.status", 1],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    hasRejectedViewer: {
                        $cond: {
                            if: {
                                $eq: ["$followOne.status", 3],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    blockedByViewer: 1,
                    followedByViewer: 1,
                    rejectedByViewer: 1,
                    requestedByViewer: 1,
                    followsViewer: 1,
                    hasBlockedViewer: 1,
                    hasRequestedViewer: 1,
                    hasRejectedViewer: 1,
                    isPrivate: 1,
                    comments: 1,
                    isOwner: 1,
                },
            },
        ]);
        post = post[0];
        if (!post) {
            throw createError.NotFound();
        } else if (post.blockedByViewer || post.hasBlockedViewer) {
            throw createError.Forbidden();
        } else if (post.isPrivate === true && !post.isOwner) {
            throw createError.Forbidden();
        }
        let comments = post.comments ? post.comments : [];
        res.json({ comments });
    } catch (err) {
        next(err);
    }
};

// This function will handle adding comment process

const addComment = async (req, res, next) => {
    try {
        let params = await commentValidator(req.params, {
            postId: 1,
        });
        let data = await commentValidator(req.body, {
            content: 1,
        });
        let post = await Post.findOne({ _id: params.postId }, { __v: 0 });
        if (!post) throw new cE("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user.toString() !== req.currentUser._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        let comment = new Comment({
            content: data.content,
            user: req.currentUser._id,
            postId: params.postId,
        });
        await comment.save();
        await comment
            .populate({
                path: "user",
                select: "userName profile",
            })
            .execPopulate();
        post.comments.push(comment._id);
        await post.save();
        res.json({ comment });
    } catch (err) {
        next(err);
    }
};

// This function will handle getting comment process

const getComment = async (req, res, next) => {
    try {
        let params = await commentValidator(req.params, {
            postId: 1,
            commentId: 1,
        });
        let post = await Post.findOne(
            { _id: params.postId },
            {
                _id: 1,
                isPrivate: 1,
            }
        ).populate({
            path: "user",
            select: "_id",
        });
        if (!post) throw new cE("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        let comment = await Comment.findOne(
            { _id: params.commentId },
            { __v: 0 }
        )
            .populate({
                path: "postId",
                select: "_id",
            })
            .populate({
                path: "user",
                select: "userName profile",
            });
        if (!comment) throw new cE("Comment Not Found !", 1022, 404);
        // else if (comment.postId._id.toString() !== post._id.toString()) {
        //   throw new cE("You don't have permission !", 1003, 403);
        // }
        res.json(comment);
    } catch (err) {
        next(err);
    }
};

// This function will handle updating comment process

const updateComment = async (req, res, next) => {
    try {
        let params = await commentValidator(req.params, {
            postId: 1,
            commentId: 1,
        });
        let data = await commentValidator(req.body, {
            content: 1,
            isPrivate: 2,
        });
        let post = await Post.findOne(
            { _id: params.postId },
            {
                _id: 1,
                isPrivate: 1,
            }
        ).populate({
            path: "user",
            select: "_id",
        });
        if (!post) throw new cE("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        let comment = await Comment.findOne(
            { _id: params.commentId },
            { __v: 0 }
        ).populate({
            path: "user",
            select: "userName profile",
        });
        if (!comment) throw new cE("Comment Not Found !", 1022, 404);
        else if (comment.postId.toString() !== post._id.toString()) {
            throw new cE("You don't have permission !", 1003, 403);
        } else if (
            req.currentUser._id.toString() !== post.user._id.toString() &&
            req.currentUser._id.toString() !== comment.user._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        comment.content = data.content;
        comment.updatedAt = Date.now();
        await comment.save();
        res.json(comment);
    } catch (err) {
        next(err);
    }
};

// This function will handle deleting comment process

const deleteComment = async (req, res, next) => {
    try {
        let params = await commentValidator(req.params, {
            postId: 1,
            commentId: 1,
        });
        let post = await Post.findOne(
            { _id: params.postId },
            {
                _id: 1,
                isPrivate: 1,
                comments: 1,
            }
        )
            .populate({
                path: "comments",
                select: "_id",
            })
            .populate({
                path: "user",
                select: "_id userName",
            });
        if (!post) throw new cE("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        let comment = await Comment.findOne(
            { _id: params.commentId },
            { __v: 0 }
        ).populate({
            path: "user",
            select: "userName profile",
        });
        if (!comment) throw new cE("Comment Not Found !", 1022, 404);
        else if (comment.postId.toString() !== post._id.toString()) {
            throw new cE("You don't have permission !", 1003, 403);
        } else if (
            req.currentUser._id.toString() !== post.user._id.toString() &&
            req.currentUser._id.toString() !== comment.user._id.toString()
        ) {
            throw new cE("You don't have permission !", 1003, 403);
        }
        let deletedComment = await Post.findOneAndUpdate(
            { _id: params.postId },
            { $pull: { comments: params.commentId } },
            { new: true }
        ).exec();
        await comment.remove();

        res.status(204);
        res.json(post);
    } catch (err) {
        next(err);
    }
};

// This function will handle liking post process

const likePost = async (req, res, next) => {
    try {
        let params = await postValidator(req.params, {
            postId: 1,
        });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $set: {
                    isOwner: {
                        $cond: [
                            { $eq: ["$user", req.currentUser._id] },
                            true,
                            false,
                        ],
                    },
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    as: "user",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$userId"],
                                },
                            },
                        },
                        {
                            $project: {
                                userName: 1,
                                profile: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "likes",
                    let: { postId: "$_id" },
                    as: "like",
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$postId", "$$postId"] },
                                        { $eq: ["$user", req.currentUser._id] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                liked: 1,
                            },
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: "$like",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    likedByViewer: {
                        $cond: [{ $eq: ["$like.liked", true] }, true, false],
                    },
                },
            },
            {
                $project: {
                    comments: 0,
                    likes: 0,
                    tags: 0,
                    __v: 0,
                },
            },
        ]);
        post = post[0];
        if (!post) {
            throw createError.NotFound();
        } else if (post.isPrivate && !post.isOwner) {
            throw createError.Forbidden();
        } else if (!post.like) {
            let like = new Like({
                user: req.currentUser._id,
                postId: post._id,
                liked: true,
            });
            await like.save();
            let pushLikeIntoPost = await Post.findOneAndUpdate(
                {
                    _id: post._id,
                },
                {
                    $push: { likes: like._id },
                },
                {
                    new: true,
                }
            );
        } else if (post.likedByViewer) {
            let like = await Like.findOne({
                postId: post._id,
                user: req.currentUser._id,
            });
            like.liked = !like.liked;
            await like.save();
            let pullLikeFromPost = await Post.findOneAndUpdate(
                {
                    _id: post._id,
                },
                {
                    $pull: {
                        likes: like._id,
                    },
                }
            );
        } else if (!post.likedByViewer) {
            let like = await Like.findOne({
                _id: post.like._id,
            });
            like.liked = !like.liked;
            await like.save();
            let pushLikeIntoPost = await Post.findOneAndUpdate(
                {
                    _id: post._id,
                },
                {
                    $push: {
                        likes: like._id,
                    },
                }
            );
        }
        res.status(204);
        res.end();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getFeedPosts,
    addPost,
    getPost,
    deletePost,
    updatePost,
    getComments,
    addComment,
    getComment,
    updateComment,
    deleteComment,
    likePost,
};
