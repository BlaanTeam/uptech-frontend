const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const conversationSchema = new Schema({
  userOne: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  userTwo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  createdAt: {
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
const messageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  convId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "conversations",
  },
});

module.exports = {
  Conversation: Model("conversations", conversationSchema),
  Message: Model("messages", messageSchema),
};
