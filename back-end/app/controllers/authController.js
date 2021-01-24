// const createError = require("http-errors");
const { createError } = require("../utils/globals");
const { User } = require("../models/authModel");
const {
    signAccessToken,
    verifyConfirmationToken,
    verifyForgotPassword,
} = require("../utils/jwt");
const { authValidator } = require("../utils/validationSchema");
const { sendConfirmation, sendForgotPassword } = require("../utils/mailer");
const client = require("../utils/redis");

// this function will handle the sign-up process
const signUp = async (req, res, next) => {
    try {
        let data = await authValidator(req.body, {
            username: 1,
            email: 1,
            password: 1,
        });
        let userEixst = await User.findOne({
            $or: [{ userName: data.username }, { userMail: data.email }],
        });
        if (userEixst)
            throw new createError(
                "Username/email already registered !",
                1092,
                409
            );
        let newUser = new User({
            userName: data.username,
            userMail: data.email,
            userPass: data.password,
            mailConfirmed: true, // TODO: set false in production
            profile: {
                firstName: "Unknown",
                lastName: "Unknown",
                bio: "The bio wrote by UpTech! Please Change it asap.",
            },
        });
        newUser.externalURL = req.externalURL;
        await newUser.hashPassword();
        await newUser.save();
        // TODO : uncommment this line in production
        // sendConfirmation(newUser, "Confirm Your Account 😇", "confirmAccount");
        res.status(201);
        res.json({ code: 2062 });
    } catch (err) {
        next(err);
    }
};

// this function will handle the sign-in process
const signIn = async (req, res, next) => {
    try {
        let data = await authValidator(req.body, {
            username: 1,
            password: 1,
            rememberMe: 2,
        });
        let user = await User.findOne(
            { userName: data.username },
            {
                resetPasswordToken: 0,
                __v: 0,
            }
        );
        if (!user)
            throw new createError(
                "This account not registered yet !",
                1030,
                404
            );
        let isMatched = await user.isValidPassword(data.password);
        let isConfirmed = await user.isConfirmed();
        if (!isMatched) {
            throw new createError("Invalid username/password", 1024, 401);
        } else if (!isConfirmed)
            throw new createError(
                "This account not confirmed yet !",
                1063,
                401
            );

        let accessToken = await signAccessToken(user.userName, data.rememberMe);
        resp = { user: { ...user._doc }, accessToken: accessToken, code: 2032 };
        delete resp.user.userPass;
        res.json(resp);
    } catch (err) {
        next(err);
    }
};

// this function will handle the account confirmation process

const confirmAccount = async (req, res, next) => {
    try {
        let data = await authValidator(req.body, {
            token: 1,
        });
        let email = await verifyConfirmationToken(data.token);
        let user = await User.findOne({ userMail: email });
        if (!user) throw new createError("Unauthorized !", 1030, 401);
        if (user.isConfirmed())
            throw new createError("Unauthorized !", 1026, 401);
        user.confirmAccount();
        await user.save();
        res.json({ msg: "Account confirmed succesfully !", code: 2041 });
    } catch (err) {
        next(err);
    }
};

// this function will handle the forgot password process

const forgotPassword = async (req, res, next) => {
    try {
        let data = await authValidator(req.body, { email: 1 });
        let user = await User.findOne({ userMail: data.email });
        if (!user)
            throw new createError("This email doesn't exist !", 1030, 404);
        user.externalURL = req.externalURL;
        let repeats = await client.getAsync(`${user.userMail}:FP`);
        if (repeats > 4) {
            throw new createError("Too many requests !", 1032, 429);
        } else if (repeats === null) {
            client.incr(`${user.userMail}:FP`);
        } else if (repeats < 4) {
            client.incr(`${user.userMail}:FP`);
        } else if (repeats == 4) {
            client.incr(`${user.userMail}:FP`);
            client.expire(`${user.userMail}:FP`, 86400);
        }
        sendForgotPassword(user, "Reset Your Password");
        res.json({
            msg: "An email has been sent !",
            code: 2013,
        });
    } catch (err) {
        next(err);
    }
};

// this function will handle the reset password process

const resetPassword = async (req, res, next) => {
    try {
        let params = await authValidator(req.params, {
            token: 1,
            userId: 1,
        });
        let user = await User.findOne({ _id: params.userId });
        if (!user) throw new createError("Unauthorized !", 1030, 401);
        let email = await verifyForgotPassword(params.token, user.userPass);
        if (user.userMail !== email) {
            throw new createError("Unauthorized !", 1030, 401);
        }
        if (req.method === "GET") {
            res.json({ email });
        } else if (req.method === "POST") {
            let data = await authValidator(req.body, { password: 1 });
            await user.resetPassword(data.password); // hash password with bcrypt
            user.save();
            res.json({ msg: "The password has been update !", code: 2029 });
        } else {
            throw new createError("Method Not Allowed!", 1003, 405);
        }
    } catch (err) {
        next(err);
    }
};

// this function will handle the re-send confirmation process

const reSendConfirmation = async (req, res, next) => {
    try {
        let data = await authValidator(req.body, { email: 1 });
        let user = await User.findOne({ userMail: data.email });
        if (!user)
            throw new createError("This email doesn't exist !", 1030, 404);
        user.externalURL = req.externalURL;
        let repeats = await client.getAsync(`${user.userMail}:RC`);
        if (repeats > 4) {
            throw new createError("Too many requests !", 1032, 429);
        } else if (repeats === null) {
            client.incr(`${user.userMail}:RC`);
        } else if (repeats < 4) {
            client.incr(`${user.userMail}:RC`);
        } else if (repeats == 4) {
            client.incr(`${user.userMail}:RC`);
            client.expire(`${user.userMail}:RC`, 86400);
        }
        sendConfirmation(user, "Confirm Your Account 😇");
        res.json({
            code: 2051,
            msg: "An email has been sent !",
        });
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
