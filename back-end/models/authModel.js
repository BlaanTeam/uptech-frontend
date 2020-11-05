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
  Pravite: {
    type: Boolean,
    default: false,
  },
});

// Iniatialize Methods To userSchema

// hashing the password

userSchema.pre("save", async function (next) {
  try {
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(this.userPass, salt);
    this.userPass = hashedPassword;
    next();
  } catch (err) {
    throw err;
  }
});

// check the password if valid
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.userPass);
  } catch (err) {
    throw err;
  }
};

// check if email comfirmed

userSchema.methods.isConfirmed = async function () {
  return !!this.mailConfirmed;
};

module.exports = {
  User: Model("users", userSchema),
};
