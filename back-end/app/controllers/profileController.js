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
                $set: {
                    isOwner: {
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
                    from: "posts",
                    let: { userId: "$_id", isOwner: "$isOwner" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $function: {
                                        body: `function (
                                            isPrivate,
                                            user,
                                            userId,
                                            isOwner
                                        ) {
                                            if (isOwner) {
                                                return (
                                                    user.valueOf() ===
                                                    userId.valueOf()
                                                );
                                            } else {
                                                return (
                                                    user.valueOf() ===
                                                        userId.valueOf() &&
                                                    !isPrivate
                                                );
                                            }
                                        }`,
                                        args: [
                                            "$isPrivate",
                                            "$user",
                                            "$$userId",
                                            "$$isOwner",
                                        ],
                                        lang: "js",
                                    },
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ],
                    as: "posts",
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
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ],
                    as: "following",
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
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                            },
                        },
                    ],
                    as: "followers",
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
                $unwind: {
                    path: "$posts",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$following",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $unwind: {
                    path: "$followers",
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
                    userName: 1,
                    userMail: {
                        $cond: [
                            { $eq: ["$_id", req.currentUser._id] },
                            "$userMail",
                            "$$REMOVE",
                        ],
                    },
                    profile: { $ifNull: ["$profile", {}] },
                    createdAt: 1,
                    isPrivate: 1,
                    blockedByViewer: 1,
                    followedByViewer: 1,
                    rejectedByViewer: 1,
                    requestedByViewer: 1,
                    followsViewer: 1,
                    hasBlockedViewer: 1,
                    hasRequestedViewer: 1,
                    hasRejectedViewer: 1,
                    following: { $ifNull: ["$following.count", 0] },
                    followers: { $ifNull: ["$followers.count", 0] },
                    posts: { $ifNull: ["$posts.count", 0] },
                    isOwner: 1,
                },
            },
        ]);

        user = user[0];

        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer) {
            throw createError.NotFound();
        } else if (user.blockedByViewer) {
            user.following = 0;
            user.followers = 0;
            user.posts = 0;
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

// update user info
const updateUser = async (req, res, next) => {
    try {
        let user = req.currentUser;
        let data = await profileValidator(req.body, {
            isPrivate: 2,
            userPass: 2,
            profile: 2,
        });
        if (Object.keys(data).length <= 1) {
            // return not modified if the data doesn't contain any fields
            res.status(304);
            res.end();
            return;
        }
        if (typeof data.isPrivate !== "undefined") {
            user.isPrivate = data.isPrivate;
        }
        if (typeof data.userPass !== "undefined") {
            // change password and hash it
            user.userPass = data.userPass;
            await user.hashPassword();
        }
        if (typeof data.profile !== "undefined") {
            user.profile = Object.assign(
                {},
                req.currentUser.profile,
                data.profile
            );
        }
        await user.save(); // update exist document
        res.status(204);
        res.end();
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    followTwo: 0,
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];
        // check if user exist
        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer || user.blockedByViewer) {
            throw createError.Forbidden();
        } else if (user.followedByViewer || user.requestedByViewer) {
            // check if the current user is already followed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.followOne) {
            //  create new follow document
            let newFollow = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: user.isPrivate ? 1 : 2,
            });
            await newFollow.save();
        } else if (user.followOne.status === 0) {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    followTwo: 0,
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];
        console.log(user);
        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer || user.blockedByViewer) {
            throw createError.Forbidden();
        } else if (!(user.followedByViewer || user.requestedByViewer)) {
            // check if the current user is already  unfollowed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (!user.followOne) {
            throw createError.Forbidden();
        } else if (user.followedByViewer || user.requestedByViewer) {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);

        user = user[0];
        console.log(user);
        if (!user) {
            throw createError.NotFound();
        } else if (!user.followOne) {
            let newBlock = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: 4,
            });
            await newBlock.save();
        } else if (user.blockedByViewer) {
            // check if current user if is already blocked this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (user.followOne.status !== 4) {
            // update exist document
            let block = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status: 4,
                    prevStatus:
                        user.isPrivate && user.followOne.status === 3
                            ? user.followOne.status
                            : null,
                }
            );
            let unFollow = await Follow.findOneAndUpdate(
                {
                    userOne: user._id,
                    userTwo: req.currentUser._id,
                },
                {
                    status: 0,
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
                        userOne: "$_id",
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
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (!user.followOne) {
            // prevent from unblocking user, not in their follow
            throw createError.Forbidden();
        } else if (!user.blockedByViewer) {
            // check the current user if is already unblocked this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (user.followOne.status === 4) {
            // update exist document
            let unBlock = await Follow.findOneAndUpdate(
                {
                    userOne: req.currentUser._id,
                    userTwo: user._id,
                },
                {
                    status:
                        typeof user.followOne.prevStatus === "undefined" ||
                        user.followOne.prevStatus === null
                            ? 0
                            : user.followOne.prevStatus,
                    $unset: {
                        prevStatus: user.followOne.prevStatus === null ? 1 : 0,
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (!user.followTwo) {
            throw createError.Forbidden();
        } else if (user.rejectedByViewer) {
            // check the current user if already reject this user
            // return not modified
            res.status(304);
            res.end();
            return;
        } else if (user.followTwo.status === 1) {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];

        if (!user) {
            throw createError.NotFound();
        } else if (!user.followTwo) {
            throw createError.Forbidden();
        } else if (user.followTwo.status === 3) {
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

// get user posts

const getUserPosts = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        let query = await profileValidator(req.query, { page: 2 });
        let perPage = 20;
        let pageNumber = query.page;
        let user = await User.aggregate([
            {
                $match: {
                    userName: params.userName,
                },
            },
            { $limit: 1 },
            {
                $set: {
                    isOwner: {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                $lookup: {
                    from: "posts",
                    let: { userId: "$_id", isOwner: "$isOwner" },
                    pipeline: [
                        {
                            $set: {
                                isOwner: {
                                    $cond: [
                                        {
                                            $eq: ["$$isOwner", true],
                                        },
                                        true,
                                        false,
                                    ],
                                },
                            },
                        },
                        {
                            $match: {
                                $expr: {
                                    $function: {
                                        body: `function (
                                            isPrivate,
                                            user,
                                            userId,
                                            isOwner
                                        ) {
                                            if (isOwner) {
                                                return (
                                                    user.valueOf() ===
                                                    userId.valueOf()
                                                );
                                            } else {
                                                return (
                                                    user.valueOf() ===
                                                        userId.valueOf() &&
                                                    !isPrivate
                                                );
                                            }
                                        }`,
                                        args: [
                                            "$isPrivate",
                                            "$user",
                                            "$$userId",
                                            "$$isOwner",
                                        ],
                                        lang: "js",
                                    },
                                },
                            },
                        },
                        {
                            $sort: {
                                createdAt: -1,
                            },
                        },
                        {
                            $facet: {
                                data: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: { userId: "$user" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                "$_id",
                                                                "$$userId",
                                                            ],
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
                                    {
                                        $lookup: {
                                            from: "likes",
                                            let: { postId: "$_id" },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $and: [
                                                                {
                                                                    $eq: [
                                                                        "$postId",
                                                                        "$$postId",
                                                                    ],
                                                                },
                                                                {
                                                                    $eq: [
                                                                        "$user",
                                                                        req
                                                                            .currentUser
                                                                            ._id,
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
                                            as: "liked",
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: "$liked",
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $addFields: {
                                            likedByViewer: {
                                                $cond: {
                                                    if: {
                                                        $eq: [
                                                            "$liked.liked",
                                                            true,
                                                        ],
                                                    },
                                                    then: true,
                                                    else: false,
                                                },
                                            },
                                            comments: { $size: "$comments" },
                                            likes: { $size: "$likes" },
                                        },
                                    },
                                    {
                                        $skip: (pageNumber - 1) * perPage,
                                    },
                                    { $limit: perPage },
                                    {
                                        $project: {
                                            __v: 0,
                                            liked: 0,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    as: "posts",
                },
            },
            {
                $unwind: {
                    path: "$posts",
                    preserveNullAndEmptyArrays: true,
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
                    posts: 1,
                    isPrivate: 1,
                    isOwner: 1,
                },
            },
        ]);
        user = user[0];

        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer || user.blockedByViewer) {
            throw createError.NotFound();
        } else if ((user.isPrivate && user.followedByViewer) || user.isOwner) {
            let posts = user.posts?.data;
            let pageInfo = user.posts?.pageInfo;
            resp = {
                posts: posts ? posts : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else if (!user.isPrivate) {
            let posts = user.posts?.data;
            let pageInfo = user.posts?.pageInfo;
            resp = {
                posts: posts ? posts : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else {
            throw createError.Forbidden();
        }
    } catch (err) {
        next(err);
    }
};

// get user following
const getUserFollowing = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        let query = await profileValidator(req.query, { page: 2 });
        let perPage = 10;
        let pageNumber = query.page;
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
                $set: {
                    isOwner: {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                $lookup: {
                    from: "follows",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userOne", "$$userId"] },
                                        { $eq: ["$status", 2] },
                                    ],
                                },
                            },
                        },
                        {
                            $facet: {
                                pageInfo: [
                                    { $count: "total" },
                                    {
                                        $addFields: {
                                            perPage: perPage,
                                            pageNumber: pageNumber,
                                            total: {
                                                $ceil: {
                                                    $divide: [
                                                        "$total",
                                                        perPage,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                                data: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: {
                                                userId: "$userTwo",
                                            },
                                            as: "user",
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                "$_id",
                                                                "$$userId",
                                                            ],
                                                        },
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: "follows",
                                                        let: {
                                                            userOne:
                                                                req.currentUser
                                                                    ._id,
                                                            userTwo: "$_id",
                                                        },
                                                        as: "followOne",
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
                                                                    _id: 0,
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: "follows",
                                                        let: {
                                                            userOne: "$_id",
                                                            userTwo:
                                                                req.currentUser
                                                                    ._id,
                                                        },
                                                        as: "followTwo",
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
                                                                    _id: 0,
                                                                },
                                                            },
                                                        ],
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
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        4,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        followedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        2,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        rejectedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        3,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        requestedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        1,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        followsViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        2,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasBlockedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        4,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasRequestedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        1,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasRejectedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        3,
                                                                    ],
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
                                                        userName: 1,
                                                        profile: 1,
                                                        isPrivate: 1,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        $unwind: "$user",
                                    },
                                    {
                                        $match: {
                                            $expr: {
                                                $ne: [
                                                    "$user.hasBlockedViewer",
                                                    true,
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $skip: (pageNumber - 1) * perPage,
                                    },
                                    {
                                        $limit: perPage,
                                    },

                                    {
                                        $project: {
                                            user: 1,
                                            _id: 0,
                                        },
                                    },
                                    {
                                        $replaceRoot: {
                                            newRoot: "$user",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    as: "following",
                },
            },
            {
                $unwind: {
                    path: "$following",
                    preserveNullAndEmptyArrays: true,
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
                    isOwner: 1,
                    following: 1,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer) {
            throw createError.NotFound();
        } else if (user.blockedByViewer) {
            throw createError.Forbidden();
        } else if ((user.isPrivate && user.followedByViewer) || user.isOwner) {
            let following = user.following?.data;
            let pageInfo = user.following?.pageInfo;
            resp = {
                following: following ? following : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else if (!user.isPrivate) {
            let following = user.following?.data;
            let pageInfo = user.following?.pageInfo;
            resp = {
                following: following ? following : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else {
            throw createError.Forbidden();
        }
    } catch (err) {
        next(err);
    }
};

// get user followers

const getUserFollowers = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        let query = await profileValidator(req.query, { page: 2 });
        let perPage = 10;
        let pageNumber = query.page;
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
                $set: {
                    isOwner: {
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                $lookup: {
                    from: "follows",
                    let: { userId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userTwo", "$$userId"] },
                                        { $eq: ["$status", 2] },
                                    ],
                                },
                            },
                        },
                        {
                            $facet: {
                                pageInfo: [
                                    { $count: "total" },
                                    {
                                        $addFields: {
                                            perPage: perPage,
                                            pageNumber: pageNumber,
                                            total: {
                                                $ceil: {
                                                    $divide: [
                                                        "$total",
                                                        perPage,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                ],
                                data: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            let: {
                                                userId: "$userOne",
                                            },
                                            as: "user",
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                "$_id",
                                                                "$$userId",
                                                            ],
                                                        },
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: "follows",
                                                        let: {
                                                            userOne:
                                                                req.currentUser
                                                                    ._id,
                                                            userTwo: "$_id",
                                                        },
                                                        as: "followOne",
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
                                                                    _id: 0,
                                                                },
                                                            },
                                                        ],
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: "follows",
                                                        let: {
                                                            userOne: "$_id",
                                                            userTwo:
                                                                req.currentUser
                                                                    ._id,
                                                        },
                                                        as: "followTwo",
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
                                                                    _id: 0,
                                                                },
                                                            },
                                                        ],
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
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        4,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        followedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        2,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        rejectedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        3,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        requestedByViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        1,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        followsViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        2,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasBlockedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        4,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasRequestedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followTwo.status",
                                                                        1,
                                                                    ],
                                                                },
                                                                then: true,
                                                                else: false,
                                                            },
                                                        },
                                                        hasRejectedViewer: {
                                                            $cond: {
                                                                if: {
                                                                    $eq: [
                                                                        "$followOne.status",
                                                                        3,
                                                                    ],
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
                                                        userName: 1,
                                                        profile: 1,
                                                        isPrivate: 1,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        $unwind: "$user",
                                    },
                                    {
                                        $match: {
                                            $expr: {
                                                $ne: [
                                                    "$user.hasBlockedViewer",
                                                    true,
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $skip: (pageNumber - 1) * perPage,
                                    },
                                    {
                                        $limit: perPage,
                                    },

                                    {
                                        $project: {
                                            user: 1,
                                            _id: 0,
                                        },
                                    },
                                    {
                                        $replaceRoot: {
                                            newRoot: "$user",
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    as: "followers",
                },
            },
            {
                $unwind: {
                    path: "$followers",
                    preserveNullAndEmptyArrays: true,
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
                    isOwner: 1,
                    followers: 1,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer) {
            throw createError.NotFound();
        } else if (user.blockedByViewer) {
            throw createError.Forbidden();
        } else if ((user.isPrivate && user.followedByViewer) || user.isOwner) {
            let followers = user.followers?.data;
            let pageInfo = user.followers?.pageInfo;
            resp = {
                followers: followers ? followers : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else if (!user.isPrivate) {
            let followers = user.followers?.data;
            let pageInfo = user.followers?.pageInfo;
            resp = {
                followers: followers ? followers : [],
                pageInfo: pageInfo ? pageInfo : {},
            };
            res.json(resp);
        } else {
            throw createError.Forbidden();
        }
    } catch (err) {
        next(err);
    }
};

// accept follow
const acceptUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent the user from accepting himself
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
                    as: "followOne",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    let: {
                        userOne: "$_id",
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
                    followOne: 0,
                    followTwo: 0,
                    profile: 0,
                    userPass: 0,
                    createdAt: 0,
                    userName: 0,
                    userMail: 0,
                    mailConfirmed: 0,
                    __v: 0,
                },
            },
        ]);
        user = user[0];
        if (!user) {
            throw createError.NotFound();
        } else if (user.hasBlockedViewer || user.blockedByViewer) {
            throw createError.Forbidden();
        } else if (user.followsViewer) {
            res.status(304);
            res.end();
            return;
        } else if (user.rejectedByViewer) {
            throw createError.Forbidden();
        } else if (user.hasRequestedViewer) {
            let followUser = await Follow.findOneAndUpdate(
                {
                    $and: [
                        {
                            userOne: user._id,
                        },
                        {
                            userTwo: req.currentUser._id,
                        },
                    ],
                },
                {
                    status: 2,
                }
            );
            res.status(204);
            res.end();
            return;
        } else {
            throw createError.Forbidden();
        }
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
    getUserPosts,
    getUserFollowing,
    getUserFollowers,
    updateUser,
    acceptUser,
};
