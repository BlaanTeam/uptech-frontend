const { User, Follow } = require("../models/authModel");
const { profileValidator } = require("../utils/validationSchema");
const createError = require("http-errors");

const getUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        let user = await User.aggregate([
            {
                $match: {
                    userName: params.userName,
                },
            },
            {
                $limit: 1,
            },
            {
                $addFields: {
                    userOnwer: {
                        $cond: {
                            if: {
                                $eq: ["$_id", req.currentUser._id],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: { userOne: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userOne", "$$userOne"] },
                                        { $eq: ["$status", 2] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                    as: "followingCount",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: { userTwo: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userTwo", "$$userTwo"] },
                                        { $eq: ["$status", 2] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                            },
                        },
                    ],
                    as: "followersCount",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userOne", "$$userOne"] },

                                        { $eq: ["$userTwo", "$$userTwo"] },
                                    ],
                                },
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
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userOne", "$$userTwo"] },

                                        { $eq: ["$userTwo", "$$userOne"] },
                                    ],
                                },
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
                    following: { $size: "$followingCount" },
                    followers: { $size: "$followersCount" },
                },
            },
            {
                $project: {
                    userName: 1,
                    userMail: {
                        $cond: [
                            { $eq: ["$_id", req.currentUser._id] },
                            "$userMail",
                            "$$REMOVE",
                        ],
                    },
                    profile: 1,
                    isPrivate: 1,
                    blockedByViewer: 1,
                    followedByViewer: 1,
                    rejectedByViewer: 1,
                    requestedByViewer: 1,
                    followsViewer: 1,
                    hasBlockedViewer: 1,
                    hasRequestedViewer: 1,
                    hasRejectedViewer: 1,
                    following: 1,
                    followers: 1,
                },
            },
        ]);

        user = user[0];

        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer) {
            throw createError.Forbidden();
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

/* 

There're five types of follow status :
0 -> Nothing
1 -> Pending
2 -> Accepted
3 -> Rejected
4 -> Blocked


*/

// this function will hanlde following user process.
const followUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent the user from following himself
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: {
                    userName: { $eq: params.userName },
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
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
                    as: "follow",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userTwo"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userOne"],
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
                    as: "block",
                },
            },
            {
                $unwind: {
                    path: "$follow",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$block",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyFollowed: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ["$follow.status", 1] },
                                    { $eq: ["$follow.status", 2] },
                                ],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    blockedMe: {
                        $cond: {
                            if: {
                                $eq: ["$block.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    follow: 1,
                    alreadyFollowed: 1,
                    isPrivate: 1,
                    blockedMe: 1,
                },
            },
        ]);
        user = user[0];
        // check if user exist
        if (!user) {
            throw createError.NotFound();
        } else if (user.blockedMe) {
            throw createError.Forbidden();
        } else if (user.alreadyFollowed) {
            // check if the current user is already followed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.follow) {
            //  create new follow document
            let newFollow = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: user.isPrivate ? 1 : 2,
            });
            await newFollow.save();
        } else if (user.follow.status === 0) {
            // update exist document
            let follow = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status: user.isPrivate ? 1 : 2,
                }
            );
        } else {
            throw createError.Forbidden();
        }
        res.status(204); // not content
        res.end();
    } catch (err) {
        next(err);
    }
};

// this function will hanlde unfollowing user process.
const unFollowUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent user from unfollowing himself
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: {
                    userName: { $eq: params.userName },
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
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
                    as: "unFollow",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userTwo"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userOne"],
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
                    as: "block",
                },
            },
            {
                $unwind: {
                    path: "$unFollow",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$block",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyUnfollowed: {
                        $cond: {
                            if: {
                                $eq: ["$unFollow.status", 0],
                            },
                            then: true,
                            else: false,
                        },
                    },
                    blockedMe: {
                        $cond: {
                            if: {
                                $eq: ["$block.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    alreadyUnfollowed: 1,
                    unFollow: 1,
                    isPrivate: 1,
                    testing: 1,
                    blockedMe: 1,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (user.blockedMe) {
            throw createError.Forbidden();
        } else if (user.alreadyUnfollowed) {
            // check if the current user is already  unfollowed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.unFollow) {
            throw createError.Forbidden();
        } else if (user.unFollow.status === 1 || user.unFollow.status === 2) {
            // update exist document
            let unFollow = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status: 0,
                }
            );
        } else {
            throw createError.Forbidden();
        }
        res.status(204);
        res.end();
    } catch (err) {
        next(err);
    }
};

const blockUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent user from blocking himself
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: {
                    userName: params.userName,
                },
            },
            { $limit: 1 },
            {
                $lookup: {
                    from: "follows",
                    let: { userOne: req.currentUser._id, userTwo: "$_id" },
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
                    as: "block",
                },
            },
            {
                $unwind: {
                    path: "$block",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyBlocked: {
                        $cond: {
                            if: {
                                $eq: ["$block.status", 4],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    alreadyBlocked: 1,
                    block: 1,
                    isPrivate: 1,
                },
            },
        ]);

        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (user.alreadyBlocked) {
            // check if current user if is already blocked this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.block) {
            let newBlock = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: 4,
            });
            await newBlock.save();
        } else if (user.block.status !== 4) {
            // update exist document
            let block = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status: 4,
                    prevStatus:
                        user.isPrivate && user.block.status === 3
                            ? user.block.status
                            : null,
                }
            );
        }
        res.status(204); // no content
        res.end();
    } catch (err) {
        next(err);
    }
};

const unBlockUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent user from unblocking himself
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: {
                    userName: params.userName,
                },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: req.currentUser._id,
                        userTwo: "$_id",
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
                                prevStatus: 1,
                            },
                        },
                    ],
                    as: "unBlock",
                },
            },
            {
                $unwind: {
                    path: "$unBlock",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyUnblocked: {
                        $cond: {
                            if: {
                                $eq: ["$unBlock.status", 0],
                            },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    unBlock: 1,
                    alreadyUnblocked: 1,
                },
            },
        ]);
        user = user[0];
        console.log(user);
        if (!user) {
            throw createError.NotFound();
        } else if (user.alreadyUnblocked) {
            // check the current user if is already unblocked this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.unBlock) {
            // prevent from unblocking user, not in their follow
            throw createError.Forbidden();
        } else if (user.unBlock.status === 4) {
            // update exist document
            let unBlock = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status:
                        typeof user.unBlock.prevStatus === "undefined" ||
                        user.unBlock.prevStatus === null
                            ? 0
                            : user.unBlock.prevStatus,
                    $unset: {
                        prevStatus: user.unBlock.prevStatus === null ? 1 : 0,
                    },
                }
            );
        } else {
            throw createError.Forbidden();
        }

        res.status(204); // no content
        res.end();
    } catch (err) {
        next(err);
    }
};

// Reject User
const rejectUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent user from rejecting himself
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: { userName: params.userName },
            },
            {
                $limit: 1,
            },
            {
                $lookup: {
                    from: "follows",
                    let: { userOne: req.currentUser._id, userTwo: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userTwo"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userOne"],
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
                    as: "reject",
                },
            },
            {
                $unwind: {
                    path: "$reject",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyRejected: {
                        $cond: {
                            if: { $eq: ["$reject.status", 3] },
                            then: true,
                            else: false,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    reject: 1,
                    alreadyRejected: 1,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (!user.reject) {
            throw createError.Forbidden();
        } else if (user.alreadyRejected) {
            // check the current user if already reject this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (user.reject.status === 1) {
            // update exist document
            let reject = await Follow.findOneAndUpdate(
                {
                    userOne: user._id,
                    userTwo: req.currentUser._id,
                },
                {
                    status: 3,
                }
            );
        } else {
            throw createError.Forbidden();
        }

        // res.json(user);
        res.status(204); // no content
        res.end();
    } catch (err) {
        next(err);
    }
};

// unReject User

const unRejectUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        if (req.currentUser.userName === params.userName) {
            throw createError.Forbidden();
        }
        let user = await User.aggregate([
            {
                $match: {
                    userName: params.userName,
                },
            },
            { $limit: 1 },
            {
                $lookup: {
                    from: "follows",
                    let: { userOne: req.currentUser._id, userTwo: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $eq: ["$userOne", "$$userTwo"],
                                        },
                                        {
                                            $eq: ["$userTwo", "$$userOne"],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                status: 1,
                                prevStatus: 1,
                            },
                        },
                    ],
                    as: "unReject",
                },
            },
            {
                $unwind: {
                    path: "$unReject",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    unReject: 1,
                },
            },
        ]);
        user = user[0];

        if (!user) {
            throw createError.NotFound();
        } else if (!user.unReject) {
            throw createError.Forbidden();
        } else if (user.unReject.status === 3) {
            // update exist document

            let unReject = await Follow.findOneAndUpdate(
                {
                    userOne: user._id,
                    userTwo: req.currentUser._id,
                },
                {
                    status: 0,
                    $unset: {
                        prevStatus: 1,
                    },
                }
            );
        } else {
            throw createError.Forbidden();
        }
        res.status(204); // not content
        res.end();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUser,
    followUser,
    unFollowUser,
    blockUser,
    unBlockUser,
    rejectUser,
    unRejectUser,
};
