const { Schema, model: Model } = require("mongoose");

const CONTENT_TYPES = {
    TYPE_TEXT: "text",
};

const conversationSchema = new Schema({
    userIds: [
        {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
    ],
    initiator: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "messages",
        },
    ],
});
conversationSchema.index({
    userIds: 1,
    initiator: 1,
});

conversationSchema.statics.initConversation = async function (
    initiator,
    userIds
) {
    try {
        let availableConv = await this.aggregate([
            {
                $match: {
                    userIds: {
                        $size: userIds.length,
                        $all: [...userIds],
                    },
                },
            },
            {
                $addFields: {
                    user: {
                        $filter: {
                            input: "$userIds",
                            as: "array",
                            cond: {
                                $ne: ["$$array", initiator],
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
            {
                $unwind: "$user",
            },
            {
                $project: {
                    __v: 0,
                    userIds: 0,
                },
            },
        ]);
        availableConv = availableConv[0];
        if (availableConv) {
            return {
                isNew: false,
                doc: availableConv,
            };
        }

        let newConv = await this.create({
            initiator,
            userIds,
        });
        return {
            isNew: true,
            doc: newConv,
        };
    } catch (err) {
        throw err;
    }
};

const messageSchema = new Schema({
    content: {
        type: Schema.Types.Mixed,
        required: true,
    },
    type: {
        type: String,
        default: CONTENT_TYPES.TYPE_TEXT,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    readByRecipients: [
        {
            _id: false,
            userId: {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
            readAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    convId: {
        type: Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
    },
});
messageSchema.index({
    convId: 1,
    createdAt: 1,
});
module.exports = {
    Conversation: Model("conversations", conversationSchema),
    Message: Model("messages", messageSchema),
};
