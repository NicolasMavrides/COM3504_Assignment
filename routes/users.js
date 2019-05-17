const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
var multer = require('multer');

var upload = multer({destination: '../public/user_images'});

var storage = multer.diskStorage({
  destination: '../public/user_images',
  filename: function(req, file, callback) {

  }
});









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
  res.render('register', { user: req.user });
});

/* POST register form. */
router.post('/register', users.createAccount);


//////////////////// Profile Page ////////////////
/* GET profile page. */
router.get('/profile/:username', users.loadProfile);

/* GET edit profile */
router.get('/edit_profile/:username', users.editProfile);

/* POST edit profile */
router.post('/edit_profile/:username', users.saveProfile);




/* GET profile picture upload page */
router.get('/edit_photo/', function(req, res, next) {
  var user = req.user.username;
  res.render('edit_photo', { user : user, username: user.username});
});


/* POST profile picture upload page */
router.post('/edit_photo/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    console.log("No file found");
    return res.send({
      success: false
    });
  } else {
    console.log('file received');
    return res.send({
      success: true
    })
  }
});

/* GET profile edit page. */
router.get('edit_profile', users.editProfile);

/* POST profile edit page. */
router.post('edit_profile', users.saveProfile);


module.exports = router;








/* GET profile photo edit page */
//router.get('/edit_photo/:username/', users.editPhoto);

/* POST profile photo edit page */
//router.post('/edit_photo/:username/', users.savePhoto);


