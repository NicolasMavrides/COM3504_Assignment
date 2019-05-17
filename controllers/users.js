var User = require('../models/user');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var email_val = require("email-validator");


exports.createAccount = function(req, res) {
    const { name, email, username, password, password_verify, avatar } = req.body;
    let errors = []; // list of possible errors that may occur
    var user = req.user;
    console.log(req.body);

    // Validation checks on field completion and password matching
    if (!name || name.length < 5) {
        errors.push({msg: 'Please provide a name that is at least 5 characters long.'});
    } else if (!email || !email_val.validate(email)) {
        errors.push({msg: 'Please provide an email that is of the correct format (eg. example@email.com).'});
    } else if (!username) {
        errors.push({msg: 'Please fill a username.'});
    } else if (!password || !password_verify) {
        errors.push({msg: 'Please fill in a password and make sure it is filled in twice.'});
    } else if (password.length < 5) {
        errors.push({ msg: 'Password cannot be less than 5 characters long.' });
    } else if (password !== password_verify) {
        errors.push( {msg: 'Passwords entered do not match, please try again.' });
    }

    // Check if any errors exist. Re-render form with entered data (minus passwords) if errors exist
    if (errors.length > 0) {
        res.render('register', {
            errors,
            user: user,
            name,
            email,
            username,
            password,
            password_verify,
            avatar: ''
        });

        // otherwise, check if the user account already exists
    } else {
        User.findOne({$or: [ { email: email }, { username: username } ]}).then(account => {
            if (account) {                                      // if it does, re-render as before
                errors.push({msg: 'Email or username already exists'});
                res.render('register', {
                    errors,
                    user: user,
                    name,
                    email,
                    username,
                    password,
                    password_verify,
                    avatar: avatar
                });

            } else {
                const newUser = new User({                  // else create the new account
                    name,
                    email,
                    username,
                    password,
                    about: "Tell the community about yourself!",
                    avatar: avatar
                });
                console.log('received: ' + newUser);
                // Use salting to encrypt the user password with bcrypt
                bcrypt.genSalt(10, (error, salt) =>
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        newUser.password = hash;         // Encrypt the new user's password
                        newUser.save().then(account => { // Save the new user account
                            if (error) {
                                errors.push({ msg: err});
                                res.render('register', {
                                    errors,
                                    user: user,
                                    name,
                                    email,
                                    username,
                                    password,
                                    password_verify,
                                    avatar: ''
                                })
                            }
                            req.flash(
                                'success',
                                'Your account was successfully created. You may now log in.'
                            );
                            res.redirect('/login');
                        }).catch(error => console.log(error));
                    })
                );
            }
        });
    }
};


exports.login = function(req, res, next) {
    const { username, password } = req.body;
    let errors = []; // list of possible errors that may occur
    var user = req.user;

    // Find the user account entered on the form
    User.findOne({ username: username }).then(account => {
        if (!account) {
            // If the account doesn't exist, push an error
            errors.push({ msg: 'Account does not exist. Please check you have entered it correctly, or register if you do not have an account' });

            res.render('login', {
                errors,
                user: user,
                username,
                password
            });
        } else {
            console.log("Start auth");
            // User account exists, now check the password...
                passport.authenticate('local', {
                    successRedirect: '/',
                    failureRedirect: '/login',
                    failureFlash: true,
                })(req, res, next);
            }
    });
};


exports.loadProfile = function(req, res, next) {
    var user = req.user;
    var username = req.params.username;
    console.log(username);

    // Find the user account entered on the form
    User.findOne({ username: username }, { "_id": 0, "name": 1 , "email": 1 , "about": 1}).then(account => {
        if (!account) {
            // If the account doesn't exist, redirect user to error page with an error message
            res.render('not_found', { user: user });

        } else {
            var name = account.name;
            var email = account.email;
            var about = account.about;
            res.render('profile', { name: name, email: email, username: username, user: user, about: about });
        }
    });
};



exports.editProfile = function(req, res, next) {
    var user = req.user;
    var name = user.name;
    var email = user.email;
    var username = user.username;
    var about = user.about;
    res.render('edit_profile', { name: name, email: email, username: username, user: user, about: about });
    console.log(name);
    console.log(email);
    console.log(username);
    console.log(about);

};


exports.saveProfile = function(req, res, next) {
    const { name, email, username, about, password, password_verify } = req.body;

    console.log(name);
    console.log(email);
    console.log(username);
    console.log(about);

    User.updateOne({username: username}, {$set:{username: username}}, function(err, result) {
        if (err)
        {
            console.log(err);
            req.flash(
                'error',
                'There was a problem updating your profile.'
            );
            res.render('edit_profile');

        }
        req.flash(
            'success',
            'Profile updated successfully!.'
        );
        res.render('profile', { name: name, email: email, username: username, about: about });
    });
};


exports.logout = function(req, res, next) {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/login');
};








   /* var username = req.params.username;
    console.log(req.body);
    User.updateMany({username: username}, {$set:{username: username}}, function(err, result) {
        if (err)
        {
            console.log(err);
            res.render('edit_profile/:username');
            req.flash(
                'error',
                'There was a problem updating your profile.'
            );
        }
        else {
            console.log(result);
            res.render('profile/'+username);
        }
    }); */


/*
exports.editPhoto = function(req, res, next) {
    var user = req.user;
    var username = req.params.username;
    res.render('edit_photo', { name: name, email: email, username: username, user: user, about: about });
};




exports.savePhoto = function(req, res, next) {
    var user = req.user;
    var username = req.params.username;
};

*/


// TODO:
// - modify User object to include avatar as field and upload image as avatar
// - Esure-authenticated & edit profile fields
// - socket.io notification
