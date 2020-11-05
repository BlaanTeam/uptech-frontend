const express = require("express");
const router = express.Router();

router.post("/sign_up", signUpController);

module.exports = router;
