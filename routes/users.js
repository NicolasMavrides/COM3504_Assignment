const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
var multer = require('multer');

var storage_location = multer.diskStorage({
  destination: './public/user_images',
  filename: function(req, res, callback) {
    callback(null, file.filename + '_' + Date.now() + path.extname(file.originalName));
  }
});

var upload = multer({
  storage: storage_location

  }).single('avatar');

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
router.get('/edit_photo/:username', function(req, res, next) {
  var username = req.params.username;
  res.render('edit_photo', { user : req.user, username: username});
});

/* POST profile picture upload page */
router.post('/edit_photo/:username/upload', upload(req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('edit_photo/' + username);
      req.flash(
          'error',
          'There was a problem updating your profile.');
    } else {
      res.render('profile/' + username);
      req.flash(
          'success',
          'Profile picture updated successfully!');
    }
  });

// CONTINUE HERE....
  
module.exports = router;

/*
  console.log(req.file);
  var username = req.params.username;
  console.log(username);
  res.redirect('profile/'+username);
);










/* GET profile edit page. */
//router.get('/edit_profile/:username', users.editProfile);

/* POST profile edit page. */
//router.post('edit_profile/:username', users.saveProfile);

/* GET profile photo edit page */
//router.get('/edit_photo/:username/', users.editPhoto);

/* POST profile photo edit page */
//router.post('/edit_photo/:username/', users.savePhoto);


