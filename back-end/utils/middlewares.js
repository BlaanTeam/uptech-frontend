const { createError } = require("./globals");
const { verifyAccessToken } = require("./jwt");
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
      if (err.isExpired === true)
        err = new createError("Invalid token or expired !", 1072, 401);
      else if (err.isInvalid === true)
        err = new createError("Invalid token or expired !", 1079, 401);
      next(err);
    }
  });
};

module.exports = {
  protectRouter,
};
