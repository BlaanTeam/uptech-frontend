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

conversationSchema.statics.initConversation = async function (
    initiator,
    userIds
) {
    try {
        let availableConv = await this.findOne(
            {
                userIds: {
                    $size: userIds.length,
                    $all: [...userIds],
                },
            },
            {
                _id: 1,
            }
        );
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
        newConv = await newConv
            .populate({
                path: "userIds",
                select: "userName profile",
            })
            .execPopulate();
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

module.exports = {
    Conversation: Model("conversations", conversationSchema),
    Message: Model("messages", messageSchema),
};
