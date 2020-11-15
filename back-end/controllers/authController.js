// const createError = require("http-errors");
const { createError } = require("../utils/globals");
const { User } = require("../models/authModel");
const {
  signAccessToken,
  verifyConfirmationToken,
  verifyForgotPassword,
} = require("../utils/jwt");
const {
  signInSchema,
  signUpSchema,
  confirmAccountSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  reSendConfirmationSchema,
} = require("../utils/validationSchema");
const { sendConfirmation, sendForgotPassword } = require("../utils/mailer");

// this function will handle the sign-up process
const signUp = async (req, res, next) => {
  try {
    let result = await signUpSchema.validateAsync(req.body);
    let userEixst = await User.findOne({
      $or: [{ userName: result.username }, { userMail: result.email }],
    });
    if (userEixst)
      throw new createError("Username/Email Already Registered !", 1092, 409);
    let newUser = new User({
      userName: result.username,
      userMail: result.email,
      userPass: result.password,
    });
    newUser.externalURL = req.externalURL;
    await newUser.hashPassword();
    await newUser.save();
    // todo : send mail confirmation
    sendConfirmation(newUser, "Confirm Your Account 😇", "confirmAccount");
    res.status(201);
    res.json({ code: 2062 });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);

    next(err);
  }
};

// this function will handle the sign-in process
const signIn = async (req, res, next) => {
  try {
    let result = await signInSchema.validateAsync(req.body);
    let user = await User.findOne({ userName: result.username });
    if (!user)
      throw new createError("This account not registered yet !", 1030, 404);
    let isMatched = await user.isValidPassword(result.password);
    let isConfirmed = await user.isConfirmed();
    if (!isMatched) {
      throw new createError("Invalid username/password", 1024, 401);
    } else if (!isConfirmed)
      throw new createError("This account not confirmed yet !", 1063, 401);

    let accessToken = await signAccessToken(user.userName, result.rememberMe);
    res.json({ accessToken, code: 2032 });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);
    next(err);
  }
};

// this function will handle the account confirmation process

const confirmAccount = async (req, res, next) => {
  try {
    let result = await confirmAccountSchema.validateAsync(req.body);
    let email = await verifyConfirmationToken(result.token);
    let user = await User.findOne({ userMail: email });
    if (!user) throw new createError("Unauthorized !", 1030, 401);
    if (user.isConfirmed()) throw new createError("Unauthorized !", 1026, 401);
    user.confirmAccount();
    await user.save();
    res.json({ confirmed: true });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);
    else if (err.isExpired === true)
      err = new createError("Invalid token or expired !", 1072, 401);
    else if (err.isInvalid === true)
      err = new createError("Invalid token or expired !", 1079, 401);
    next(err);
  }
};

// this function will handle the forgot password process

const forgotPassword = async (req, res, next) => {
  try {
    let result = await forgotPasswordSchema.validateAsync(req.body);
    let user = await User.findOne({ userMail: result.email });
    if (!user) throw new createError("The Email Is Not Exist !", 1030, 404);
    user.externalURL = req.externalURL;
    sendForgotPassword(user, "Reset Your Password");
    res.json({
      msg: "Forgot Password Email Has Been Sent!",
      code: 2013,
    });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);
    next(err);
  }
};

// this function will handle the reset password process

const resetPassword = async (req, res, next) => {
  try {
    let result = await resetPasswordSchema.validateAsync(req.body);
    let email = await verifyForgotPassword(result.token);
    let user = await User.findOne({ userMail: email });
    if (!user) throw new createError("Unauthorized !", 1030, 401);
    user.resetPassword(result.password);
    res.json({ msg: "The password has been update !", code: 2029 });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);
    else if (err.isExpired === true)
      err = new createError("Invalid token or expired !", 1072, 401);
    else if (err.isInvalid === true)
      err = new createError("Invalid token or expired !", 1079, 401);
    next(err);
  }
};

// this function will handle the re-send confirmation process

const reSendConfirmation = async (req, res, next) => {
  try {
    let result = await reSendConfirmationSchema.validateAsync(req.body);
    let user = await User.findOne({ userMail: result.email });
    if (!user) throw new createError("The Email Is Not Exist !", 1030, 404);
    user.externalURL = req.externalURL;
    let isRespect = user.reConfirmTooManyRequest();
    await user.save();
    if (!isRespect) throw new createError("Too Many Requests !", 1032, 429);
    sendConfirmation(user, "Confirm Your Account 😇");
    res.json({
      code: 2051,
      msg: "An Email Has BeenSent !",
    });
  } catch (err) {
    if (err.isJoi === true) err = new createError(err.message, 1049, 422);
    next(err);
  }
};

module.exports = {
  signIn,
  signUp,
  confirmAccount,
  forgotPassword,
  resetPassword,
  reSendConfirmation,
};
