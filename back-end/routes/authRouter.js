const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign_in", authController.signIn);
router.post("/sign_up", authController.signUp);
router.post("/confirm_account", authController.confirmAccount);
router.post("/forgot_password", authController.forgotPassword);
router.post("/reset_password", authController.resetPassword);
module.exports = router;
