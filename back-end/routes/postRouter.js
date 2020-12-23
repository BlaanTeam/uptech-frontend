const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController.js");
const { protectRouter } = require("../utils/middlewares");

protectRouter(router);
router.get("/posts", postController.feedPosts);
router.post("/posts", postController.createPost);
router.get("/posts/:postId", postController.retrievePost);
router.delete("/posts/:postId", postController.deletePost);
router.put("/posts/:postId", postController.updatePost);

module.exports = router;
