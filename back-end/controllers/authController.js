const createError = require("http-errors");
const { User } = require("../models/authModel");
const { signAccessToken, verifyConfirmationToken } = require("../utils/jwt");
const { signInSchema, signUpSchema } = require("../utils/validationSchema");
const { sendConfirmation } = require("../utils/mailer");
const jwt = require("../utils/jwt");
const { verify } = require("jsonwebtoken");

// this function will handle the sign-up process
signUp = async (req, res, next) => {
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
    res.json({ registered: true });
  } catch (err) {
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

// this function will handle the sign-in process
signIn = async (req, res, next) => {
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
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

// this function will handle the account confirmation process

confirmAccount = async (req, res, next) => {
  try {
    let email = await verifyConfirmationToken(req.params.token);
    let user = await User.findOne({ userMail: email });
    if (!user) throw createError.NotFound();
    if (user.isConfirmed()) throw createError.NotFound();
    user.confirmAccount();
    await user.save();
    res.json({ confimed: true });
  } catch (err) {
    if (err.isJWT === true)
      err = createError.NotFound("Invalid token or expired !");
    else if (err.isInvalid === true) err = createError.NotFound();
    next(err);
  }
};

module.exports = { signIn, signUp, confirmAccount };
