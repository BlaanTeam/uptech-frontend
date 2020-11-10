const createError = require("http-errors");
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
      throw createError.Conflict("username/email already registered");
    let newUser = new User({
      userName: result.username,
      userMail: result.email,
      userPass: result.password,
    });
    newUser.externalURL = req.externalURL;
    await newUser.hashPassword();
    // todo : send mail confirmation
    sendConfirmation(newUser, "Confirm Your Account 😇", "confirmAccount");
    res.status(201);
    res.json({ registered: true });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;

    next(err);
  }
};

// this function will handle the sign-in process
const signIn = async (req, res, next) => {
  try {
    let result = await signInSchema.validateAsync(req.body);
    let user = await User.findOne({ userName: result.username });
    if (!user) throw createError.NotFound("this account not registered yet !");
    let isMatched = await user.isValidPassword(result.password);
    let isConfirmed = await user.isConfirmed();
    if (!isMatched) throw createError.Unauthorized("invalid username/password");
    else if (!isConfirmed)
      throw createError.Forbidden("this account not confirmed yet !");
    let accessToken = await signAccessToken(user.userName, result.rememberMe);
    res.json({ accessToken });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;

    next(err);
  }
};

// this function will handle the account confirmation process

const confirmAccount = async (req, res, next) => {
  try {
    let result = await confirmAccountSchema.validateAsync(req.body);
    let email = await verifyConfirmationToken(result.token);
    let user = await User.findOne({ userMail: email });
    if (!user) throw createError.NotFound();
    if (user.isConfirmed()) throw createError.NotFound();
    user.confirmAccount();
    await user.save();
    res.json({ confirmed: true });
  } catch (err) {
    if (err.isJoi === true) err.status = 404;
    if (err.isJWT === true)
      err = createError.UnprocessableEntity("Invalid token or expired !");
    else if (err.isInvalid === true) err = createError.NotFound();
    next(err);
  }
};

// this function will handle the forgot password process

const forgotPassword = async (req, res, next) => {
  try {
    let result = await forgotPasswordSchema.validateAsync(req.body);
    let user = await User.findOne({ userMail: result.email });
    if (!user) throw createError.NotFound("This email not exist !");
    user.externalURL = req.externalURL;
    sendForgotPassword(user, "Reset Your Password");
    res.json({
      msg: "An email contain the link to reset password has been sent !",
    });
  } catch (err) {
    if (err.isJoi === true) err.status = 422;
    next(err);
  }
};

// this function will handle the reset password process

const resetPassword = async (req, res, next) => {
  try {
    let result = await resetPasswordSchema.validateAsync(req.body);
    let email = await verifyForgotPassword(result.token);
    let user = await User.findOne({ userMail: email });
    if (!user) throw createError.Forbidden();
    user.resetPassword(result.password);
    res.json({ msg: "The password has been update !" });
  } catch (err) {
    if (err.isJWT === true)
      err = createError.UnprocessableEntity("Invalid token or expired !");
    next(err);
  }
};

// this function will handle the re-send confirmation process

const reSendConfirmation = async (req, res, next) => {
  try {
    let result = await reSendConfirmationSchema.validateAsync(req.body);
    let user = await User.findOne({ userMail: result.email });
    if (!user) throw createError.NotFound("This email not registered");
    user.externalURL = req.externalURL;
    sendConfirmation(user, "Confirm Your Account 😇", "confirmAccount");
    res.json({ success: true });
  } catch (err) {
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
