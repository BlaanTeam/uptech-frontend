const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { pattern } = require("../config/config");

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
        picture: {
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
    isPrivate: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
    },
});
userSchema.index(
    {
        userName: 1,
    },
    { unique: true }
);

const followSchema = new Schema({
    userOne: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    userTwo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
    },
    status: {
        type: Number,
        required: true,
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

// check if reset password token already used
userSchema.methods.checkIfAlreadyUsed = function (token) {
    if (token === this.resetPasswordToken) {
        return true;
    }
    return false;
};

module.exports = {
    User: Model("users", userSchema),
    Follow: Model("follow", followSchema),
};
