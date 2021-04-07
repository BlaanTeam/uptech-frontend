const router = require("express").Router();
const { protectRouter } = require("../utils/middlewares");
const chatController = require("../controllers/chatController");

// protect the router
protectRouter(router);
router.post("/", chatController.initConversation);
router.get("/", chatController.getConversations);
router.get("/:convId/messages", chatController.getMessages);
router.post("/:convId/messages", chatController.sendMessage);

module.exports = router;
