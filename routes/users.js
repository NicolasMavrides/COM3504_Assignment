const express = require('express');
const router = express.Router();
const users = require('../controllers/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/////////////////// Login //////////////////////
/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { user : req.user });
});

/* POST login form. */
router.post('/login', function(req, res, next) {
  var login= req.body.username;
  var password= req.body.password;

  if ((users.list.some(item => item.username === login)) && (users.list.some(item => item.password === password))) {
    res.render('index', { user : req.user });
  } else {
    res.render('login', { user : req.user });
  }
});

//////////////////// Register //////////////////
/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { user : req.user });
  //console.log(users.list);
});

/* POST register form. */
// Register
router.post('/register', users.createAccount);

//////////////////// Test Account //////////////////
/* GET register page. */
const User = require('../models/user');

router.get('/login1', function(req, res, next) {
  User.findOne({$or: [ { username: 'aca15in' } ]}).then(user => {
    console.log(user);
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      console.log("Logged In")
      return res.render('index', {user: user});
    });
  });
});

module.exports = router;