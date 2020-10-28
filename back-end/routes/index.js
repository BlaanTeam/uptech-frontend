var express = require('express');
var router = express.Router();


// The Home Page Route 

router.get('/', function(req, res, next) {
  res.json({"msg":"Home Page"})
});

module.exports = router;
