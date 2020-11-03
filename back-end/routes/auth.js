var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.json({
    data: req.body,
    msg: "Hello From Auth endpoint",
  });
});

module.exports = router;
