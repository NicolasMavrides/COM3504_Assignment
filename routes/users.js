const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
var multer = require('multer');
var path = require('path');
var User = require('../models/user');


var storage_location = multer.diskStorage({
  destination: './public/user-images/avatars',
  filename: function(req, file, callback) {
    callback(null, req.user.username + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage_location

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
router.get('/edit_profile/', users.editProfile);

/* POST edit profile */
router.post('/edit_profile/', users.saveProfile);


/* GET profile picture upload page */
router.get('/edit_photo/', function(req, res, next) {
  var user = req.user.username;
  res.render('edit_photo', { user : user, username: user.username});
});


/* POST profile picture upload page */
router.post('/upload', upload.single('avatar'), function(req, res) {
  if (req.user) {
    var avatar_name = req.user.username + path.extname(req.file.originalname);
    console.log(req.file.originalname);
    User.updateOne({ _id : req.user._id }, {$set:{avatar: avatar_name}}, function(err, result) {
      if (err) {
        console.log(err);
        req.flash(
            'error',
            'There was a problem updating your picture.'
        );
      }
    });

    res.redirect('/profile/' + req.user.username)
  }
  else {
    res.redirect('/login');
  }
});


/*
User.updateOne({ _id : req.user._id }, {$set:{avatar: req.file.originalname}}, function(err, result) {
  console.log(result);
  if (err)
  {
    console.log(err);
    req.flash(
        'error',
        'There was a problem updating your picture.'
    );
    res.redirect('/profile/' + req.user.username)

  }
});

*/

/* GET profile edit page. */
router.get('/edit_profile', users.editProfile);

/* POST profile edit page. */
router.post('/edit_profile', users.saveProfile);


module.exports = router;








/* GET profile photo edit page */
//router.get('/edit_photo/:username/', users.editPhoto);

/* POST profile photo edit page */
//router.post('/edit_photo/:username/', users.savePhoto);


