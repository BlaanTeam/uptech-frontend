const joi = require("joi");
const mongoose = require("mongoose");
const { pattern } = require("../config/config");

const objectId = (message, options) => {
    return joi.string().custom((value, helper) => {
        try {
            let result = mongoose.Types.ObjectId(value);
            return result;
        } catch (err) {
            return helper.message(message, {
                ...options,
            });
        }
    });
};

const validator = (schema, selectors = {}) => {
    const requiredFields = [];
    const optionalFields = [];
    const forbiddenFields = [];
    schema._ids._byKey.forEach((el) => {
        switch (selectors[el.id]) {
            case 1:
                requiredFields.push(el.id);
                break;
            case 2:
                optionalFields.push(el.id);
                break;
            default:
                forbiddenFields.push(el.id);
        }
    });
    schema = schema.fork(requiredFields, (field) => field.required());
    schema = schema.fork(optionalFields, (field) => field.optional());
    schema = schema.fork(forbiddenFields, (field) => field.forbidden());
    return schema;
};
const authValidator = async (credentials, selectors) => {
    try {
        let authSchema = joi.object({
            username: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid username")
                .lowercase()
                .trim(),
            email: joi
                .string()
                .pattern(pattern.email)
                .message("Please fill a valid email")
                .lowercase()
                .trim(),
            password: joi
                .string()
                .pattern(pattern.password)
                .message("Please fill a valid password"),
            rememberMe: joi.boolean().default(false),
            token: joi
                .string()
                .pattern(pattern.jwtToken)
                .message("Please fill a valid token"),
            userId: objectId("Post Doesn't Exist!", { postNotFound: true }),
        });
        authSchema = validator(authSchema, selectors);
        return await authSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};

const postValidator = async (credentials, selectors) => {
    try {
        let postSchema = joi.object({
            postId: objectId("Post Doesn't Exist!", { postNotFound: true }),
            content: joi.string().min(2).max(5000).trim(),
            isPrivate: joi.boolean().default(false),
            createdAt: joi.date().iso(),
        });
        postSchema = validator(postSchema, selectors);
        return await postSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};

const commentValidator = async (credentials, selectors) => {
    try {
        let commentSchema = joi.object({
            content: joi.string().trim(),
            isPrivate: joi.boolean().default(false),
            page: joi.number().greater(0).default(1),
            postId: objectId("Post Doesn't Exist!", { postNotFound: true }),
            commentId: objectId("Comment Doesn't Exist!", {
                postNotFound: true,
            }),
        });

        commentSchema = validator(commentSchema, selectors);
        return await commentSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};

const profileValidator = async (credentials, selectors) => {
    try {
        let profileSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName")
                .lowercase()
                .trim(),
            userPass: joi
                .string()
                .pattern(pattern.password)
                .message("Please fill a valid password"),
            isPrivate: joi.boolean(),
            page: joi.number().greater(0).default(1),
            profile: joi.object({
                firstName: joi.string().trim(),
                lastName: joi.string().trim(),
                picture: joi
                    .string()
                    .pattern(pattern.url)
                    .message("Please fill a valid profile picture link"),
                bio: joi
                    .string()
                    .pattern(pattern.bio)
                    .message("Please fill a valid bio")
                    .trim(),
            }),
        });
        profileSchema = validator(profileSchema, selectors);
        return await profileSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};
const followValidator = async (credentials, selectors) => {
    try {
        followSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName"),
        });
        followSchema = validator(followSchema, selectors);
        return await followSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};

const chatValidator = async (credentials, selectors) => {
    try {
        chatSchema = joi.object({
            convId: objectId("Conversation Doesn't Exist!"),
            messageId: objectId("Message Doesn't Exist!"),
            content: joi.string().max(50000).trim(),
            userId: objectId("User Doesn't Exist !"),
            page: joi.number().greater(0).default(1),
        });
        chatSchema = validator(chatSchema, selectors);
        return await chatSchema.validateAsync(credentials);
    } catch (err) {
        if (err.isJoi) {
            err.status = 400;
            err.code = 1049;
            // TODO add message in  production
            // err.message = "Missing or invalid fields.";
        }
        throw err;
    }
};
module.exports = {
    authValidator,
    postValidator,
    commentValidator,
    profileValidator,
    followValidator,
    chatValidator,
};
