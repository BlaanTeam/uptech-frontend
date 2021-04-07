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

module.exports = {
    initConversation,
};
