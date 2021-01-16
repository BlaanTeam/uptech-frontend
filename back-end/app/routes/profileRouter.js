const express = require("express");
const profileController = require("../controllers/profileController");
const { protectRouter } = require("../utils/middlewares");
const router = express.Router();
protectRouter(router);

router.get("/:userName", profileController.getUser);

router.put("/following/:userName", profileController.followUser);
router.delete("/following/:userName", profileController.unFollowUser);

router.put("/blocks/:userName", profileController.blockUser);
router.delete("/blocks/:userName", profileController.unBlockUser);
router.put("/rejects/:userName", profileController.rejectUser);
router.delete("/rejects/:userName", profileController.unRejectUser);
module.exports = router;
