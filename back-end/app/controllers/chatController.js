const { Conversation, Message } = require("../models/chatModel");
const { User } = require("../models/authModel");
const { chatValidator } = require("../utils/validationSchema");
const { isUserActive, getSessions } = require("../utils/redis");
const socket = require("../utils/socketIo");
const createError = require("http-errors");

const initConversation = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let data = await chatValidator(req.body, { userId: 1 });
        let user = await User.findOne(
            {
                _id: data.userId,
            },
            {
                userName: 1,
                profile: 1,
            }
        );

        if (!user || currentUser._id.toString() === data.userId.toString()) {
            throw createError.Forbidden();
        }
        let conv = await Conversation.initConversation(currentUser._id, [
            currentUser._id,
            data.userId,
        ]);
        if (!conv.isNew) {
            res.json(conv);
            return;
        } else if (!conv) {
            throw createError.Forbidden();
        }
        res.json(conv);
    } catch (err) {
        next(err);
    }
};

const getConversations = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let query = await chatValidator(req.query, { createdAt: 2 });
        let perPage = 20;
        let matchQuery = {};
        if (query.createdAt) {
            matchQuery = {
                $and: [
                    { userIds: currentUser._id },
                    { messages: { $elemMatch: { $exists: true } } },
                    { timestamp: { $lt: query.createdAt } },
                ],
            };
        } else {
            matchQuery = {
                $and: [
                    { userIds: currentUser._id },
                    { messages: { $elemMatch: { $exists: true } } },
                ],
            };
        }
        let conv = await Conversation.aggregate([
            {
                $sort: {
                    timestamp: -1,
                },
            },
            {
                $match: matchQuery,
            },
            {
                $limit: perPage,
            },
            {
                $addFields: {
                    lastMessage: {
                        $arrayElemAt: ["$messages", -1],
                    },
                    user: {
                        $filter: {
                            input: "$userIds",
                            as: "array",
                            cond: { $ne: ["$$array", currentUser._id] },
                        },
                    },
                },
            },
            {
                $unwind: "$user",
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
            {
                $unwind: "$user",
            },
            {
                $lookup: {
                    from: "messages",
                    let: { messageId: "$lastMessage" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$_id", "$$messageId"],
                                },
                            },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
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
                                as: "userId",
                            },
                        },
                        { $unwind: "$userId" },
                        {
                            $addFields: {
                                read: {
                                    $cond: [
                                        {
                                            $eq: [
                                                {
                                                    $size: {
                                                        $filter: {
                                                            input:
                                                                "$readByRecipients",
                                                            as: "array",
                                                            cond: {
                                                                $eq: [
                                                                    "$$array.userId",
                                                                    currentUser._id,
                                                                ],
                                                            },
                                                        },
                                                    },
                                                },
                                                1,
                                            ],
                                        },
                                        true,
                                        false,
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0,
                                convId: 0,
                                readByRecipients: 0,
                            },
                        },
                    ],
                    as: "lastMessage",
                },
            },
            {
                $unwind: "$lastMessage",
            },
            {
                $project: {
                    userIds: 0,
                    messages: 0,
                    __v: 0,
                },
            },
        ]);
        res.json(conv);
    } catch (err) {
        next(err);
    }
};

const sendMessage = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let params = await chatValidator(req.params, { convId: 1 });
        let data = await chatValidator(req.body, { content: 1 });
        let conv = await Conversation.aggregate([
            {
                $match: {
                    _id: params.convId,
                },
            },
            {
                $addFields: {
                    isOwner: {
                        $cond: [
                            {
                                $eq: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: "$userIds",
                                                as: "array",
                                                cond: {
                                                    $eq: [
                                                        "$$array",
                                                        currentUser._id,
                                                    ],
                                                },
                                            },
                                        },
                                    },
                                    1,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    userId: {
                        $filter: {
                            input: "$userIds",
                            as: "array",
                            cond: {
                                $eq: ["$$array", currentUser._id],
                            },
                        },
                    },
                    otherUserId: {
                        $filter: {
                            input: "$userIds",
                            as: "array",
                            cond: {
                                $ne: ["$$array", currentUser._id],
                            },
                        },
                    },
                },
            },
            { $unwind: "$userId" },
            { $unwind: "$otherUserId" },
            {
                $lookup: {
                    from: "users",
                    let: { userId: "$userId" },
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
            {
                $unwind: "$user",
            },
            {
                $project: {
                    __v: 0,
                    userIds: 0,
                    messages: 0,
                },
            },
        ]);
        conv = conv[0];
        console.log(conv);
        if (!conv) {
            throw createError.NotFound();
        } else if (!conv.isOwner) {
            // check if the user is the owner of this conversation
            throw createError.Forbidden();
        }
        let message = await Message.create({
            content: data.content,
            userId: currentUser._id,
            convId: conv._id,
            readByRecipients: [{ userId: currentUser._id }],
        });
        await Conversation.findOneAndUpdate(
            {
                _id: params.convId,
            },
            {
                timestamp: Date.now(),
                $addToSet: {
                    messages: message._id,
                },
            },
            {
                projection: {
                    _id: 1,
                },
            }
        );
        conv.lastMessage = message;
        let isActive = await isUserActive(conv.otherUserId);
        if (isActive) {
            let sessionIds = await getSessions(conv.otherUserId);
            sessionIds.forEach((id) => {
                socket.to(id);
            });
            // emit the message event
            socket.emit("message", conv);
        }
        res.json(message);
    } catch (err) {
        next(err);
    }
};

const getMessages = async (req, res, next) => {
    try {
        let params = await chatValidator(req.params, { convId: 1 });
        let perPage = 20;
        let query = await chatValidator(req.query, { createdAt: 2 });
        let matchQuery = {};
        if (query.createdAt) {
            matchQuery = {
                $expr: {
                    $and: [
                        {
                            $lt: ["$createdAt", query.createdAt],
                        },
                        {
                            $eq: ["$convId", "$$convId"],
                        },
                    ],
                },
            };
        } else {
            matchQuery = {
                $expr: {
                    $eq: ["$convId", "$$convId"],
                },
            };
        }
        let conv = await Conversation.aggregate([
            {
                $match: {
                    _id: params.convId,
                },
            },
            {
                $addFields: {
                    user: {
                        $filter: {
                            input: "$userIds",
                            as: "array",
                            cond: {
                                $ne: ["$$array", req.currentUser._id],
                            },
                        },
                    },
                },
            },
            {
                $unwind: "$user",
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
            {
                $project: {
                    _id: 1,
                    user: 1,
                },
            },
            {
                $lookup: {
                    from: "messages",
                    let: { convId: "$_id" },
                    pipeline: [
                        {
                            $match: matchQuery,
                        },
                        {
                            $sort: { createdAt: -1 },
                        },
                        {
                            $limit: perPage,
                        },
                        {
                            $sort: { createdAt: 1 },
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { userId: "$userId" },
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
                        {
                            $unwind: "$user",
                        },
                        {
                            $addFields: {
                                isOwner: {
                                    $cond: [
                                        {
                                            $eq: [
                                                "$user._id",
                                                req.currentUser._id,
                                            ],
                                        },
                                        true,
                                        false,
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                userId: 0,
                                convId: 0,
                                readByRecipients: 0,
                                __v: 0,
                            },
                        },
                    ],
                    as: "messages",
                },
            },
        ]);
        conv = conv[0];
        if (!conv) {
            throw createError.NotFound();
        }
        res.json(conv);
    } catch (err) {
        next(err);
    }
};

const deleteMessage = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let params = await chatValidator(req.params, { messageId: 1 });
        let message = await Message.findOne(
            { _id: params.messageId },
            { _id: 1, userId: 1 }
        );
        if (!message) {
            throw createError.NotFound();
        } else if (message.userId.toString() !== currentUser._id.toString()) {
            throw createError.Forbidden();
        }
        // remove it from messages
        await message.remove();
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};
const editMessage = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let params = await chatValidator(req.params, { messageId: 1 });
        let data = await chatValidator(req.body, { content: 1 });
        let message = await Message.findOne(
            { _id: params.messageId },
            { _id: 1, userId: 1 }
        );
        if (!message) {
            throw createError.NotFound();
        } else if (message.userId.toString() !== currentUser._id.toString()) {
            throw createError.Forbidden();
        }
        // update content of message
        message.content = data.content;
        message = await message.save();
        res.json(message);
    } catch (err) {
        next(err);
    }
};
module.exports = {
    initConversation,
    getConversations,
    sendMessage,
    getMessages,
    deleteMessage,
    editMessage,
};
