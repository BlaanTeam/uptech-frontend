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
            // redirect or return 304 Not Modified !
            // res.status(304).end()
            res.redirect(302, `chats/${conv.doc._id}/messages`);
            return;
        } else if (!conv.doc) {
            throw createError.Forbidden();
        }
        res.json(conv.doc);
    } catch (err) {
        next(err);
    }
};

const getConversations = async (req, res, next) => {
    try {
        let currentUser = req.currentUser;
        let conv = await Conversation.aggregate([
            {
                $sort: {
                    timestamp: -1,
                },
            },
            {
                $match: {
                    userIds: currentUser._id,
                    messages: { $elemMatch: { $exists: true } },
                },
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
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ]);
        conv = conv[0];
        if (!conv) {
            throw createError.NotFound();
        } else if (!conv.isOwner) {
            // check if the user is the owner of this conversation
            throw createError.Forbidden();
        }
        let userId = conv.userIds.filter(
            (id) => id.toString() !== currentUser._id.toString()
        );
        let message = await Message.create({
            content: data.content,
            userId: currentUser._id,
            convId: conv._id,
            readByRecipients: [{ userId: currentUser._id }],
        });
        conv = await Conversation.findOneAndUpdate(
            {
                _id: params.convId,
            },
            {
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
        let isActive = isUserActive(userId[0]);
        if (isActive) {
            let sessionIds = await getSessions(userId[0]);
            sessionIds.forEach((id) => {
                socket.to(id);
            });
            // emit the message event
            socket.emit("message", message);
        }
        res.json(message);
    } catch (err) {
        next(err);
    }
};

const getMessages = async (req, res, next) => {
    try {
        let params = await chatValidator(req.params, { convId: 1 });
        let perPage = 10;
        let conv = await Conversation.aggregate([
            {
                $match: {
                    _id: params.convId,
                },
            },
            {
                $project: {
                    _id: 1,
                },
            },
            {
                $lookup: {
                    from: "messages",
                    let: { convId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$convId", "$$convId"],
                                },
                            },
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
        res.json(conv.messages);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    initConversation,
    getConversations,
    sendMessage,
    getMessages,
};
