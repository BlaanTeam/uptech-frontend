const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign_in", authController.signIn);
router.post("/sign_up", authController.signUp);
router.post("/confirm_account", authController.confirmAccount);
router.post("/forgot_password", authController.forgotPassword);
router.all("/reset_password/:userId/:token", authController.resetPassword);
router.post("/resend_confirmation", authController.reSendConfirmation);
module.exports = router;
