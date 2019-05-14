const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
var passport = require('passport');

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
router.post('/login', users.login);

/* GET logout */
router.get('/logout', users.logout);


//////////////////// Register //////////////////
/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* POST register form. */
router.post('/register', users.createAccount);


//////////////////// Dashboard ////////////////
/* GET dashboard page. */
router.get('/profile/:id', function(req, res, next) {
    //users.findById(req.params.id);
    res.render('profile');
});

/* POST dashboard page. */
//router.post('/profile', users.createAccount);


module.exports = router;