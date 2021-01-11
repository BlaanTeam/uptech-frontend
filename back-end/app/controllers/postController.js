const { createError } = require("../utils/globals");
const { Post, Comment, Like, Tag } = require("../models/postModel");
const {
    postValidator,
    commentValidator,
} = require("../utils/validationSchema");

// This function will handle retrieving feed posts process
const feedPosts = async (req, res, next) => {
    try {
        // let totalPages = await Post.countDocuments({ isPrivate: false });
        let query = await postValidator(req.query, { offset: 2, limit: 2 });
        // TODO : add per page options
        // const perPage = 50;
        // const page = 4;
        let posts = await Post.aggregate([
            { $match: { isPrivate: false } },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "postId",
                    // let: { post_id: "_id" },
                    // pipeline: [{ $match: { $expr: { $eq: ["$$post_id", "$postId"] } } }],
                    as: "commentCount",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "postId",
                    // let: { post_id: "_id" },
                    // pipeline: [{ $match: { $expr: { $eq: ["$$post_id", "$postId"] } } }],
                    as: "likesCount",
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: req.currentUser._id },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_id", "$$userId"] } },
                        },
                        {
                            $project: {
                                userName: 1,
                                profile: 1,
                            },
                        },
                    ],
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $lookup: {
                    from: "likes",
                    // localField: "_id",
                    // foreignField: "postId",
                    let: { postId: "$_id", userId: req.currentUser._id },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$postId", "$$postId"],
                                        },
                                        {
                                            $eq: ["$user", "$$userId"],
                                        },
                                    ],
                                },
                            },
                        },
                        { $project: { userName: 1, profile: 1 } },
                    ],
                    as: "liked",
                },
            },

            {
                $addFields: {
                    totalComments: { $size: "$commentCount" },
                    totalLikes: { $size: "$likesCount" },
                    isLiked: {
                        $cond: {
                            if: {
                                $eq: [{ $size: "$liked" }, 1],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    liked: 0,
                    comments: 0,
                    likes: 0,
                    tags: 0,
                    __v: 0,
                    commentCount: 0,
                    likesCount: 0,
                    userInfo: 0,
                    "user.userPass": 0,
                    "user.resetPasswordToken": 0,
                    "user.userMail": 0,
                    "user.mailConfirmed": 0,
                    "user.createdAt": 0,
                    "user.__v": 0,
                },
            },
            { $sort: { createdAt: -1 } },
            { $skip: query.offset },
            { $limit: query.limit },
        ]);

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
        res.status(201);
        res.json(newPost);
    } catch (err) {
        next(err);
    }
};
// This function will handle the retrieving post process

const getPost = async (req, res, next) => {
    try {
        let commentsLimit = 10;
        let likesLimit = 10;
        let params = await postValidator(req.params, { postId: 1 });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $lookup: {
                    from: "likes",
                    let: { userId: req.currentUser._id, postId: params.postId },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$postId", "$$postId"],
                                        },
                                        {
                                            $eq: ["$user", "$$userId"],
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                    as: "liked",
                },
            },
            // { $unwind: "$liked" },
            {
                $addFields: {
                    totalComments: { $size: "$comments" },
                    totalLikes: { $size: "$likes" },
                    isLiked: {
                        $cond: {
                            if: { $eq: [{ $size: "$liked" }, 1] },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    liked: 0,
                    comments: 0,
                    likes: 0,
                    tags: 0,
                    __v: 0,
                },
            },

            {
                $lookup: {
                    from: "comments",
                    let: { postId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
                        { $project: { __v: 0 } },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$user" },
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
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        { $sort: { createdAt: -1 } },
                        { $limit: commentsLimit },
                    ],
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    let: { postId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$postId", "$$postId"] } } },
                        { $project: { __v: 0 } },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$user" },
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
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        { $limit: likesLimit },
                    ],
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: req.currentUser._id },
                    pipeline: [
                        {
                            $match: { $expr: { $eq: ["$_id", "$$userId"] } },
                        },
                        {
                            $project: {
                                userName: 1,
                                profile: 1,
                            },
                        },
                    ],
                    as: "user",
                },
            },
            { $unwind: "$user" },
        ]);
        post = post[0];
        if (!post) throw new createError("Post Not Found", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        let post = await Post.findOne(
            { _id: params.postId },
            { __v: 0, comments: 0, likes: 0, tags: 0 }
        );
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (post.user.toString() !== req.currentUser._id.toString()) {
            throw new createError("You don't have permission !", 1003, 403);
        } else if (
            post.isPrivate === true &&
            post.user.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
        }
        await post.remove();
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
        let post = await Post.findOne(
            { _id: params.postId },
            { __v: 0, comments: 0, likes: 0, tags: 0 }
        );
        console.log(post);
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (post.user.toString() !== req.currentUser._id.toString()) {
            throw new createError("You don't have permission !", 1003, 403);
        } else if (post.user.toString() !== req.currentUser._id.toString()) {
            throw new createError("You don't have permission !", 1003, 403);
        }
        // update documments
        post.content = data.content;
        post.isPrivate = data.isPrivate;
        post.updatedAt = Date.now();
        await post.save();
        res.json(post);
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
        let query = await commentValidator(req.query, {
            offset: 2,
            limit: 2,
        });
        let post = await Post.aggregate([
            {
                $match: {
                    _id: params.postId,
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$postId", "$$postId"] },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$user" },
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
                                as: "user",
                            },
                        },
                        { $unwind: "$user" },
                        { $project: { __v: 0 } },
                        { $sort: { createdAt: -1 } },
                        { $limit: query.limit },
                        { $skip: query.offset },
                    ],
                    as: "comments",
                },
            },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$user" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$_id", "$$userId"] },
                            },
                        },
                        { $project: { userName: 1, profile: 1 } },
                    ],
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    __v: 0,
                    likes: 0,
                    tags: 0,
                },
            },
        ]);
        post = post[0];
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
        }
        res.json({ comments: post.comments });
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
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        if (!comment) throw new createError("Comment Not Found !", 1022, 404);
        // else if (comment.postId._id.toString() !== post._id.toString()) {
        //   throw new createError("You don't have permission !", 1003, 403);
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
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        if (!comment) throw new createError("Comment Not Found !", 1022, 404);
        else if (comment.postId._id.toString() !== post._id.toString()) {
            throw new createError("You don't have permission !", 1003, 403);
        } else if (
            req.currentUser._id.toString() !== post.user._id.toString() &&
            req.currentUser._id.toString() !== comment.user._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        if (!comment) throw new createError("Comment Not Found !", 1022, 404);
        else if (comment.postId._id.toString() !== post._id.toString()) {
            throw new createError("You don't have permission !", 1003, 403);
        } else if (
            req.currentUser._id.toString() !== post.user._id.toString() &&
            req.currentUser._id.toString() !== comment.user._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
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
        let post = await Post.findOne(
            { _id: params.postId },
            { likes: 1, isPrivate: 1 }
        ).populate({
            path: "user",
            select: "userName profile",
        });
        if (!post) throw new createError("Post Not Found !", 1021, 404);
        else if (
            post.isPrivate === true &&
            post.user._id.toString() !== req.currentUser._id.toString()
        ) {
            throw new createError("You don't have permission !", 1003, 403);
        }
        let isLikingPost = await post.isLikedByUser(req.currentUser._id);

        if (isLikingPost === true) {
            let like = await Like.findOne({
                user: req.currentUser._id,
                postId: post._id,
            });

            let deletedLike = await Post.findOneAndUpdate(
                {
                    _id: post._id,
                },
                { $pull: { likes: like._id } },
                { new: true }
            );
            await like.remove();
        } else {
            let like = new Like({
                user: req.currentUser._id,
                postId: post._id,
            });
            await like.save();
            post.likes.push(like._id);
            await post.save();
        }
        res.json({
            status: "ok",
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    feedPosts,
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
