const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { pattern } = require("../config/config");

mongoose.set("useCreateIndex", true);

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [pattern.username, "Please fill a valid username"],
  },
  userMail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [pattern.email, "Please fill a valid email"],
  },
  userPass: {
    type: String,
    required: true,
    match: [pattern.password, "Please fill a valid password"],
  },
  profile: {
    image: {
      type: String,
      match: [pattern.url, "Please fill a valid image url"],
    },
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    bio: {
      type: String,
      trim: true,
      match: [pattern.bio, "Please fill a valid bio"],
    },
  },
  mailConfirmed: {
    type: Boolean,
    default: false,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  private: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },
  reSendConfirmationTooManyRequest: {
    timestamp: {
      type: Date,
    },
    repeated: {
      type: Number,
      default: 0,
    },
  },
  forgotPasswordTooManyRequest: {
    timestamp: {
      type: Date,
    },
    repeated: {
      type: Number,
      default: 0,
    },
  },
});

// Iniatialize Methods To userSchema

// hashing the password

userSchema.methods.hashPassword = async function () {
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.userPass, salt);
    this.userPass = hashedPassword;
  } catch (err) {
    throw err;
  }
};
// reset password

userSchema.methods.resetPassword = async function (password) {
  try {
    this.userPass = password;
    await this.hashPassword();
  } catch (err) {
    throw err;
  }
};

// check the password if valid
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.userPass);
  } catch (err) {
    throw err;
  }
};

// check if email comfirmed

userSchema.methods.isConfirmed = function () {
  return !!this.mailConfirmed;
};

// confirm the account

userSchema.methods.confirmAccount = function () {
  this.mailConfirmed = true;
};

// resend confirmation too many request

userSchema.methods.reConfirmTooManyRequest = function () {
  if (this.reSendConfirmationTooManyRequest.timestamp) {
    this.reSendConfirmationTooManyRequest.repeated = 0;

    if (
      Date.now() - Date.parse(this.reSendConfirmationTooManyRequest.timestamp) >
      8.64e7
    ) {
      this.reSendConfirmationTooManyRequest.timestamp = null;
      this.reSendConfirmationTooManyRequest.repeated++;
      return true;
    } else {
      return false;
    }
  } else if (this.reSendConfirmationTooManyRequest.repeated >= 4) {
    this.reSendConfirmationTooManyRequest.timestamp = Date.now();
    return false;
  } else {
    this.reSendConfirmationTooManyRequest.repeated++;
    return true;
  }
};
// forgot password too many request
userSchema.methods.forgotPassTooManyRequest = function () {
  if (this.forgotPasswordTooManyRequest.timestamp) {
    this.forgotPasswordTooManyRequest.repeated = 0;

    if (
      Date.now() - Date.parse(this.forgotPasswordTooManyRequest.timestamp) >
      8.64e7
    ) {
      this.forgotPasswordTooManyRequest.timestamp = null;
      this.forgotPasswordTooManyRequest.repeated++;
      return true;
    } else {
      return false;
    }
  } else if (this.forgotPasswordTooManyRequest.repeated >= 4) {
    this.forgotPasswordTooManyRequest.timestamp = Date.now();
    return false;
  } else {
    this.forgotPasswordTooManyRequest.repeated++;
    return true;
  }
};
// check if reset password token already used
userSchema.methods.checkIfAlreadyUsed = function (token) {
  if (token === this.resetPasswordToken) {
    return true;
  }
  return false;
};

module.exports = {
  User: Model("users", userSchema),
};
