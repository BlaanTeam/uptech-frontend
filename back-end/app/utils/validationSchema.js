const joi = require("joi");
const mongoose = require("mongoose");
const { pattern } = require("../config/config");

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const signInSchema = joi.object({
    username: joi
        .string()
        .pattern(pattern.username)
        .message("Please fill a valid username")
        .required()
        .lowercase()
        .trim(),
    password: joi
        .string()
        .pattern(pattern.password)
        .message("Please fill a valid password")
        .required(),
    rememberMe: joi.boolean().default(false).optional(),
});

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const signUpSchema = joi.object({
    username: joi
        .string()
        .pattern(pattern.username)
        .message("Please fill a valid username")
        .required()
        .lowercase()
        .trim(),
    email: joi
        .string()
        .pattern(pattern.email)
        .message("Please fill a valid email")
        .required()
        .lowercase()
        .trim(),
    password: joi
        .string()
        .pattern(pattern.password)
        .message("Please fill a valid password")
        .required(),
});

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const confirmAccountSchema = joi.object({
    token: joi
        .string()
        .pattern(pattern.jwtToken)
        .message("Invalid token")
        .required(),
});

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const forgotPasswordSchema = joi.object({
    email: joi
        .string()
        .pattern(pattern.email)
        .message("Please fill a valid email")
        .required(),
});

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const resetPasswordSchema = joi.object({
    token: joi
        .string()
        .pattern(pattern.jwtToken)
        .message("Please fill a valid token")
        .required(),
    password: joi
        .string()
        .pattern(pattern.password)
        .message("Please fill a valid password")
        .required(),
});

// this function will check the req.body and if all params validate will return them else will throw an error with missing
const reSendConfirmationSchema = joi.object({
    email: joi
        .string()
        .pattern(pattern.email)
        .message("Please fill a valid email")
        .required(),
});

const postSchema = joi.object({
    postBody: joi.string().min(2).max(5000).required().trim(),
    isPrivate: joi.boolean().required().default(false),
});
const postIdSchema = joi.object({
    postId: joi
        .string()
        .custom((value, helper) => {
            try {
                let result = mongoose.Types.ObjectId(value);
                return result;
            } catch (err) {
                return helper.message("Post Not Found!");
            }
        })
        .required(),
});

const feedPostsSchema = joi.object({
    offset: joi.number().optional().default(0),
    limit: joi.number().greater(0).less(101).optional().default(50),
});

const commentSchema = joi.object({
    commentBody: joi.string().required().trim(),
});
const getCommentsSchema = joi.object({
    offset: joi.number().optional().default(0),
    limit: joi.number().greater(0).less(101).optional().default(50),
});
const commentIdSchema = joi.object({
    postId: joi
        .string()
        .custom((value, helper) => {
            try {
                let result = mongoose.Types.ObjectId(value);
                return result;
            } catch (err) {
                return helper.message("Post Not Found!");
            }
        })
        .required(),
    commentId: joi
        .string()
        .custom((value, helper) => {
            try {
                let result = mongoose.Types.ObjectId(value);
                return result;
            } catch (err) {
                return helper.message("Comment Not Found!");
            }
        })
        .required(),
});

const profileValidator = async (credentials, requiredFields = []) => {
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
        profileSchema = profileSchema.fork(requiredFields, (field) =>
            field.required()
        );
        return await profileSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};
const followValidator = async (credentials, requiredFields = []) => {
    try {
        followSchema = joi.object({
            userName: joi
                .string()
                .pattern(pattern.username)
                .message("Please fill a valid userName"),
        });
        followSchema = followSchema.fork(requiredFields, (field) =>
            field.required()
        );
        return await followSchema.validateAsync(credentials);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    signInSchema,
    signUpSchema,
    confirmAccountSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    reSendConfirmationSchema,
    postSchema,
    postIdSchema,
    feedPostsSchema,
    commentSchema,
    getCommentsSchema,
    commentIdSchema,
    profileValidator,
    followValidator,
};
