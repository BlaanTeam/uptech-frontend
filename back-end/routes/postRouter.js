const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController.js");
const { protectRouter } = require("../utils/middlewares");

protectRouter(router);
router.get("/posts", postController.feedPosts);
router.get("/posts/:postId", postController.getPost);
router.post("/posts", postController.addPost);
router.put("/posts/:postId", postController.updatePost);
router.delete("/posts/:postId", postController.deletePost);
router.get("/posts/:postId/comments", postController.getComments);
router.post("/posts/:postId/comments", postController.addComment);
router.get("/posts/:postId/comments/:commentId", postController.getComment);
router.put("/posts/:postId/comments/:commentId", postController.updateComment);
router.delete(
  "/posts/:postId/comments/:commentId",
  postController.deleteComment
);
router.post("/posts/:postId/like", postController.likePost);

module.exports = router;
