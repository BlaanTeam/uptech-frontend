const { createError } = require("./globals");
const { verifyAccessToken, signAccessToken } = require("./jwt");
const { User } = require("../models/authModel");

// this function will protect the route by check the access token if exist in headers and if really valid
const protectRouter = (router) => {
    router.use(async (req, res, next) => {
        try {
            if (!req.headers.hasOwnProperty("x-auth-token"))
                throw new createError("Unauthorized !", 1075, 401);
            let accessToken = req.headers["x-auth-token"]?.trim();
            let payload = await verifyAccessToken(accessToken);
            let user = await User.findOne(
                { userName: payload.username },
                { userPass: 0 }
            );
            if (!user) throw new createError("Unauthorized !", 1030, 401);
            req.currentUser = user;
            next();
        } catch (err) {
            next(err);
        }
    });
};
// this function will protect the socketio from any unauthorized request
const protectSocketIo = async (socket, next) => {
    try {
        if (!socket.handshake.headers.hasOwnProperty("x-auth-token")) {
            throw new createError("Unauthorized !", 1075, 401);
        }
        let accessToken = socket.handshake.headers["x-auth-token"]?.trim();
        let payload = await verifyAccessToken(accessToken);
        let user = await User.findOne(
            { userName: payload.username },
            { userPass: 0 }
        );
        if (!user) throw new createError("Unauthorized !", 1030, 401);
        socket.currentUser = user;
        next();
    } catch (err) {
        next({ message: JSON.stringify(err) });
    }
};

module.exports = {
    protectRouter,
    protectSocketIo,
};
