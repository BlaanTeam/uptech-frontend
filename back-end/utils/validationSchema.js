const joi = require("joi");
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

module.exports = {
  signInSchema,
  signUpSchema,
};
