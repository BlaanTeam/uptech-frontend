const express = require("express");
const profileController = require("../controllers/profileController");
const { protectRouter } = require("../utils/middlewares");
const router = express.Router();
protectRouter(router);

router.get("/profiles/:userName", profileController.getProfile);
router.get("/profiles", profileController.getMyProfile);
router.put("/profiles", profileController.updateProfile);
module.exports = router;
