const joi = require("joi");
const mongoose = require("mongoose");
const { pattern } = require("../config/config");

const validator = (schema, select = {}) => {
    const requiredFields = [];
    const optionalFields = [];
    const forbiddenFields = [];
    schema._ids._byKey.forEach((el) => {
        switch (select[el.id]) {
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
const authValidator = async (credentials, select) => {
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
            userId: joi.string().custom((value, helper) => {
                try {
                    let result = mongoose.Types.ObjectId(value);
                    return result;
                } catch (err) {
                    return helper.message("Account Not Found!", {
                        postNotFound: true,
                    });
                }
            }),
        });
        authSchema = validator(authSchema, select);
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

const postValidator = async (credentials, select) => {
    try {
        let postSchema = joi.object({
            postId: joi.string().custom((value, helper) => {
                try {
                    let result = mongoose.Types.ObjectId(value);
                    return result;
                } catch (err) {
                    return helper.message("Post Not Found!", {
                        postNotFound: true,
                    });
                }
            }),
            content: joi.string().min(2).max(5000).trim(),
            isPrivate: joi.boolean().default(false),
            createdAt: joi.date().iso(),
        });
        postSchema = validator(postSchema, select);
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

const commentValidator = async (credentials, select) => {
    try {
        let commentSchema = joi.object({
            content: joi.string().trim(),
            isPrivate: joi.boolean().default(false),
            page: joi.number().greater(0).default(1),
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

        commentSchema = validator(commentSchema, select);
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

const profileValidator = async (credentials, select) => {
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
        profileSchema = validator(profileSchema, select);
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
const followValidator = async (credentials, select) => {
    try {
        followSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName"),
        });
        followSchema = validator(followSchema, select);
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

module.exports = {
    authValidator,
    postValidator,
    commentValidator,
    profileValidator,
    followValidator,
};
