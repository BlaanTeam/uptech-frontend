const jwt = require("jsonwebtoken");
const { jwtSecrets } = require("../config/config");

// this function will generate an access token based on the username param and access token secret key
const signAccessToken = async (username, rememberMe) => {
    try {
        let accessToken = await jwt.sign(
            { username },
            jwtSecrets.accessTokenSecretKey,
            {
                expiresIn: rememberMe ? "144h" : "24h",
            }
        );
        return accessToken;
    } catch (err) {
        console.error(err);
    }
};
const verifyAccessToken = async (accessToken) => {
    try {
        let payload = await jwt.verify(
            accessToken,
            jwtSecrets.accessTokenSecretKey
        );
        return payload;
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            err.code = 1072;
            err.status = 401;
            err.message = "Invalid token or expired !";
        } else if (err.name === "JsonWebTokenError") {
            err.code = 1079;
            err.status = 401;
            err.message = "Invalid token or expired !";
        }
        throw err;
    }
};

const signConfirmationToken = async (email) => {
    try {
        let token = await jwt.sign(
            { email },
            jwtSecrets.confirmationSecretKey,
            {
                expiresIn: "24h",
            }
        );
        return token;
    } catch (err) {
        throw err;
    }
};
const verifyConfirmationToken = async (token) => {
    try {
        let payload = await jwt.verify(token, jwtSecrets.confirmationSecretKey);
        return payload["email"];
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            err.code = 1072;
            err.status = 401;
            err.message = "Invalid token or expired !";
        } else if (err.name === "JsonWebTokenError") {
            err.code = 1079;
            err.status = 401;
            err.message = "Invalid token or expired !";
        }
        throw err;
    }
};

const signForgotPassword = async (email, password) => {
    try {
        let token = await jwt.sign(
            { email },
            jwtSecrets.forgotPasswordSecretKey + password,
            {
                expiresIn: "30m",
            }
        );
        return token;
    } catch (err) {
        throw err;
    }
};

const verifyForgotPassword = async (token, password) => {
    try {
        let payload = await jwt.verify(
            token,
            jwtSecrets.forgotPasswordSecretKey + password
        );
        return payload["email"];
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            err.code = 1072;
            err.status = 401;
            err.message = "Invalid token or expired !";
        } else if (err.name === "JsonWebTokenError") {
            err.code = 1079;
            err.status = 401;
            err.message = "Invalid token or expired !";
        }
        throw err;
    }
};

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signConfirmationToken,
    verifyConfirmationToken,
    signForgotPassword,
    verifyForgotPassword,
};
