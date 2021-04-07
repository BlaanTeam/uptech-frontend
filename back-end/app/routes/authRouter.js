const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/confirm-account", authController.confirmAccount);
router.post("/forgot-password", authController.forgotPassword);
router.all("/reset-password/:userId/:token", authController.resetPassword);
router.post("/resend-confirmation", authController.reSendConfirmation);
module.exports = router;
