const { User, Follow } = require("../models/authModel");
const { profileValidator } = require("../utils/validationSchema");
const { createError } = require("../utils/globals");

// This function will handle getting the profile  process
const getProfile = async (req, res, next) => {
    try {
        let result = await profileValidator(req.params, { userName: 1 });
        let user = await User.findOne(
            { userName: result.userName },
            {
                userPass: 0,
                mailConfirmed: 0,
                resetPasswordToken: 0,
                __v: 0,
            }
        );
        resp = { ...user?._doc };
        if (!user) {
            throw new createError("Profile Not Found", 1030, 404);
        } else if (user._id.toString() !== req.currentUser._id.toString()) {
            delete resp.userMail;
            // TODO: if there's any sensitive info in the profile, please pull it from `resp`
        }
        res.json(resp);
    } catch (err) {
        if (err.isJoi === true) {
            err.status = 400;
        }
        next(err);
    }
};
// This function will handle getting my profile process
const getMyProfile = async (req, res, next) => {
    try {
        let resp = { ...req.currentUser._doc };
        delete resp.userPass;
        delete resp.reSendConfirmationTooManyRequest;
        delete resp.forgotPasswordTooManyRequest;
        delete resp.mailConfirmed;
        delete resp.resetPasswordToken;
        delete resp.__v;

        res.json(resp);
    } catch (err) {
        next(err);
    }
};

// This function will handle updating profile process

const updateProfile = async (req, res, next) => {
    try {
        let result = await profileValidator(req.body, { profile: 2 });
        // TODO : avoid change userName
        let user = req.currentUser;
        user._doc.profile = { ...user._doc.profile, ...result.profile };
        delete result.profile;
        user._doc = { ...user._doc, ...result };
        if (result.userPass) {
            await user.hashPassword();
        }
        let updatedUser = await User.findOneAndUpdate(
            { _id: req.currentUser._id },
            { ...user._doc },
            { new: true }
        );
        res.json({ status: "ok" });
    } catch (err) {
        console.dir(err);
        if (err.isJoi) {
            err.status = 400;
        }
        next(err);
    }
};

/* 

There're five types of follow status :
0 -> Nothing
1 -> Pending
2 -> Accepted
3 -> Declined
4 -> Blocked


*/

// this function will hanlde following user process.
const followUser = async (req, res, next) => {
    try {
        let params = await profileValidator(req.params, { userName: 1 });
        // prevent the user to follow himself
        if (req.currentUser.userName === params.userName) {
            let err = new createError("You can't follow yourself !", 1020, 403);
            next(err);
            return;
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
                                        {
                                            $or: [
                                                { $eq: ["$status", 1] },
                                                { $eq: ["$status", 2] },
                                            ],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0,
                            },
                        },
                    ],
                    as: "follow",
                },
            },
            {
                $unwind: {
                    path: "$follow",
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
                },
            },
            {
                $project: {
                    alreadyFollowed: 1,
                    _id: 1,
                    isPrivate: 1,
                },
            },
        ]);
        user = user[0];
        // check if user exist
        if (!user) {
            throw new createError("Account doesn't exist !", 1030, 404);
        } else if (user.alreadyFollowed) {
            // check if the current user is already followed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        }

        let follow = await Follow.findOne({
            userOne: req.currentUser._id.toString(),
            userTwo: user._id.toString(),
            status: 0,
        });
        if (!follow) {
            //  create new follow document
            let newFollow = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: user.isPrivate ? 1 : 2,
            });
            await newFollow.save();
        } else {
            // update exist document
            follow.status = user.isPrivate ? 1 : 2;
            await follow.save();
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
        // prevent user from unfollow himself
        if (req.currentUser.userName === params.userName) {
            let err = new createError(
                "You can't unfollow yourself !",
                1023,
                403
            );
            next(err);
            return;
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
                                        {
                                            $eq: ["$status", 0],
                                        },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0,
                            },
                        },
                    ],
                    as: "follow",
                },
            },
            {
                $unwind: {
                    path: "$follow",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    alreadyUnfollowed: {
                        $cond: {
                            if: {
                                $eq: ["$follow.status", 0],
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
                    follow: 1,
                    isPrivate: 1,
                },
            },
        ]);
        user = user[0];

        if (!user) {
            throw new createError("Account doesn't exist !", 1030, 404);
        } else if (user.alreadyUnfollowed) {
            // check if the current user is already  unfollowed this user
            // return not modified
            res.status(304);
            res.end();
            return;
        }

        let unFollow = await Follow.findOne({
            userOne: req.currentUser._id.toString(),
            userTwo: user._id.toString(),
            $or: [{ status: 1 }, { status: 2 }],
        });

        if (!unFollow) {
            throw new createError(
                "You can't unfollow a user who you don't follow !",
                1029,
                403
            );
        } else {
            // update exist document
            unFollow.status = 0;
            await unFollow.save();
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
        }

        let block = await Follow.findOne({
            userOne: req.currentUser._id,
            userTwo: user._id,
        });
        if (!block) {
            let newBlock = new Follow({
                userOne: req.currentUser._id,
                userTwo: user._id,
                status: 4,
            });
            await newBlock.save();
        } else if (block.status !== 4) {
            // update exist document
            block.status = 4;
            await block.save();
        }
        res.status(204); // no content
        res.end();
    } catch (err) {
        next(err);
    }
};
module.exports = {
    getProfile,
    getMyProfile,
    updateProfile,
    followUser,
    unFollowUser,
    blockUser
};
