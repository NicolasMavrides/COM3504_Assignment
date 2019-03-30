var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/////////////////// Login //////////////////////
var users = require('../controllers/users');

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'My Class', login_is_correct: true });

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
  console.log(users.list);
});

/* POST register form. */
router.post('/register', users.create);

module.exports = router;