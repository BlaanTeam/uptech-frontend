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
    read: {
        type: Boolean,
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
        let availableConv = await this.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            },
        });
        if (availableConv) {
            return {
                isNew: false,
                convId: availableConv.doc_._id,
            };
        }

        let newConv = await this.create({
            initiator,
            userIds,
        });
        return {
            isNew: true,
            convId: newConv._doc._id,
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
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    convId: {
        type: Schema.Types.ObjectId,
        ref: "conversations",
        required: true,
    },
});

messageSchema.statics.createMessage = async function (
    content,
    type = CONTENT_TYPES.TYPE_TEXT.anchor,
    userId,
    convId
) {
    try {
        let newMessage = await this.create({
            content,
            type,
            userId,
            convId,
        });
        return newMessage;
    } catch (err) {
        throw err;
    }
};

module.exports = {
    Conversation: Model("conversations", conversationSchema),
    Message: Model("messages", messageSchema),
};
