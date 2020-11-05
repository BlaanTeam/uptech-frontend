const createError = require("http-errors");
const { User } = require("../models/authModel");
const { signAccessToken } = require("../utils/jwt");
const { signInSchema, signUpSchema } = require("../utils/validationSchema");

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
    await newUser.save();
    // todo : send mail confirmation
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

module.exports = { signIn, signUp };
