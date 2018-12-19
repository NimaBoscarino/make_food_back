var express = require('express');
var router = express.Router();
var shell = require('shelljs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/run_script', function(req, res, next) {
  // trigger casper_scripts/test
  console.log(shell.exec('node_modules/.bin/casperjs casper_scripts/test.js'))
  res.json({message: 'suh'});
});


module.exports = router;
