var express = require('express');
var router = express.Router();

//middleware function
router.use('/',function(req, res, next){
	next();
});

//route handlers
router.get('/',function(req, res){
	res.sendfile('public/main.html');
});

router.get('/firstTab',function(req, res){
	res.sendfile('public/demo.html');
});

module.exports = router;
