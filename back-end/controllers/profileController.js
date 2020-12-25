const { User } = require("../models/authModel");
const { profileIdSchema, profileSchema } = require("../utils/validationSchema");
const { createError } = require("../utils/globals");

// This function will handle getting the profile  process
const getProfile = async (req, res, next) => {
  try {
    let result = await profileIdSchema.validateAsync(req.params);
    let user = await User.findOne(
      { _id: result.userId },
      {
        userPass: 0,
        reSendConfirmationTooManyRequest: 0,
        forgotPasswordTooManyRequest: 0,
        mailConfirmed: 0,
        resetPasswordToken: 0,
        __v: 0,
      }
    );
    resp = { ...user?._doc };
    if (!user) {
      throw new createError("Profile Not Found", 1030, 404);
    } else if (user._id.toString() !== req.currentUser._id.toString()) {
      delete resp.userMail;
      // TODO: if there's any sensitive info in the profile, please pull it from `resp`
    }
    res.json(resp);
  } catch (err) {
    if (err.isJoi === true) {
      err.status = 400;
    }
    next(err);
  }
};
// This function will handle getting my profile process
const getMyProfile = async (req, res, next) => {
  try {
    let resp = { ...req.currentUser._doc };
    delete resp.userPass;
    delete resp.reSendConfirmationTooManyRequest;
    delete resp.forgotPasswordTooManyRequest;
    delete resp.mailConfirmed;
    delete resp.resetPasswordToken;
    delete resp.__v;

    res.json(resp);
  } catch (err) {
    next(err);
  }
};

// This function will handle updating profile process

const updateProfile = async (req, res, next) => {
  try {
    let result = await profileSchema.validateAsync(req.body);
    let user = req.currentUser;
    user._doc.profile = { ...user._doc.profile, ...result.profile };
    delete result.profile;
    user._doc = { ...user._doc, ...result };
    if (result.userPass) {
      await user.hashPassword();
    }
    let updatedUser = await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { ...user._doc },
      { new: true }
    );
    res.json({ status: "ok" });
  } catch (err) {
    console.dir(err);
    if (err.isJoi) {
      err.status = 400;
    }
    next(err);
  }
};

module.exports = {
  getProfile,
  getMyProfile,
  updateProfile,
};
