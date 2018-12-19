var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/run_script', function(req, res, next) {
  // trigger casper_scripts/test

  res.json({message: 'suh'});
});


module.exports = router;
