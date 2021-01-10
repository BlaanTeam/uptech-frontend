const joi = require("joi");
const mongoose = require("mongoose");
const { pattern } = require("../config/config");

const validator = (schema, requiredFields, forbiddenFields) => {
    schema = schema.fork(requiredFields, (field) => field.required());
    schema = schema.fork(forbiddenFields, (field) => field.forbidden());
    return schema;
};
const authValidator = async (credentials, requiredFields, forbiddenFields) => {
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
        });
        authSchema = validator(authSchema, requiredFields, forbiddenFields);
        return await authSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};

const postValidator = async (credentials, requiredFields, forbiddenFields) => {
    try {
        let postSchema = joi.object({
            postId: joi.string().custom((value, helper) => {
                try {
                    let result = mongoose.Types.ObjectId(value);
                    return result;
                } catch (err) {
                    return helper.message("Post Not Found!");
                }
            }),
            content: joi.string().min(2).max(5000).trim(),
            isPrivate: joi.boolean().default(false),
            offset: joi.number().optional().default(0),
            limit: joi.number().greater(0).less(101).optional().default(50),
        });
        postSchema = validator(postSchema, requiredFields, forbiddenFields);
        return await postSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};

const commentValidator = async (
    credentials,
    requiredFields = [],
    forbiddenFields = []
) => {
    try {
        let commentSchema = joi.object({
            content: joi.string().trim(),
            offset: joi.number().optional().default(0),
            limit: joi.number().greater(0).less(101).optional().default(50),
            postId: joi.string().custom((value, helper) => {
                try {
                    let result = mongoose.Types.ObjectId(value);
                    return result;
                } catch (err) {
                    return helper.message("Post Not Found!");
                }
            }),
            commentId: joi.string().custom((value, helper) => {
                try {
                    let result = mongoose.Types.ObjectId(value);
                    return result;
                } catch (err) {
                    return helper.message("Comment Not Found!");
                }
            }),
        });

        commentSchema = validator(
            commentSchema,
            requiredFields,
            forbiddenFields
        );
        return await commentSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};

const profileValidator = async (
    credentials,
    requiredFields = [],
    forbiddenFields = []
) => {
    try {
        let profileSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName"),
            userPass: joi
                .string()
                .pattern(pattern.password)
                .message("Please fill a valid password"),
            isPrivate: joi.boolean(),
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
        profileSchema = validator(
            profileSchema,
            requiredFields,
            forbiddenFields
        );
        return await profileSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};
const followValidator = async (
    credentials,
    requiredFields = [],
    forbiddenFields = []
) => {
    try {
        followSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName"),
        });
        followSchema = validator(followSchema, requiredFields, forbiddenFields);
        return await followSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    authValidator,
    postValidator,
    commentValidator,
    profileValidator,
    followValidator,
};
