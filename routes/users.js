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
  res.render('login', { title: 'User Login', login_is_correct: true });
});

/* POST login form. */
router.post('/login', function(req, res, next) {
  var login= req.body.username;
  var password= req.body.password;

  if ((users.list.some(item => item.username === login)) && (users.list.some(item => item.password === password))) {
    res.render('index', { login_is_correct: true });
  } else {
    res.render('login', { login_is_correct: false });
  }
});

//////////////////// Register //////////////////
/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { login_is_correct: true });
  //console.log(users.list);
});

/* POST register form. */
// Register
router.post('/register', users.createAccount);

module.exports = router;