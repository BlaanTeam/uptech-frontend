var express = require('express');
var router = express.Router();


// The Home Page Route 

router.get('/', function(req, res, next) {
  res.json({"msg":"Home Page"})

});

router.post('/getUsernameInfo',(req,res)=>{
  res.status(404)
  res.json(
    {
      username:req.body.username,
      status:"Not Found"
    }
  )
})

module.exports = router;
