const createError = require("http-errors");
const { verifyAccessToken } = require("./jwt");
const { User } = require("../models/authModel");

// this function will protect the route by check the access token if exist in headers and if really valid
const protectRouter = (router) => {
  router.use(async (req, res, next) => {
    try {
      if (!req.headers["x-auth-token"]) throw createError.Unauthorized();

      let accessToken = req.headers["x-auth-token"].trim();
      let payload = await verifyAccessToken(accessToken);
      let user = await User.findOne({ userName: payload.username });
      if (!user) throw createError.Unauthorized();
      req.currentUser = user;
      next();
    } catch (err) {
      if (err.isJWT === true) {
        err = createError.Unauthorized();
      }
      next(err);
    }
  });
};

module.exports = {
  protectRouter,
};
