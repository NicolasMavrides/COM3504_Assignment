var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/////////////////// Login //////////////////////

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'My Class', login_is_correct: true });
});

/* POST login form. */
router.post('/login', function(req, res, next) {
  var login= req.body.username;
  var password= req.body.password;

  if (login=='nicolas' || login== 'idris'){
    res.render('index', { title: login,  login_is_correct: true });
  } else {
    res.render('login', { title: 'My Class', login_is_correct: false });
  }

});


//////////////////// Register //////////////////

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'My Class', login_is_correct: true });
});

/* POST register form. */
router.post('/register', function(req, res, next) {
  //var login= req.body.login;
  //var password= req.body.password;
  // Other vars here related to user information...

  // When user hits submit, validate information and add to database tables etc.

});

module.exports = router;
