const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/sign_in", authController.signIn);
router.post("/sign_up", authController.signUp);
router.get("/confirm_account/:token", authController.confirmAccount);

module.exports = router;
