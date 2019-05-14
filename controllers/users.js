// var fs = require('fs-extra'); Seems to be unneeded for now
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');

/**
 * @param firstname
 * @param lastname
 * @param email
 * @param username
 * @param password
 * @constructor
 */

exports.createAccount = function(req, res) {
    const { name, email, username, password, password_verify } = req.body;
    let errors = []; // list of possible errors that may occur

    // Validation checks on field completion and password matching
    if (!name || !email || !username || !password || !password_verify) {
        errors.push({ msg: 'You have left one or more fields empty. Please make sure to fill in all fields!' });
    } else if (password.length < 5) {
        errors.push({ msg: 'Password cannot be less than 5 characters long.' });
    } else if (password !== password_verify) {
        errors.push( {msg: 'Passwords entered do not match, please try again.' });
    }

    // Check if any errors exist. Re-render form with entered data (minus passwords) if errors exist
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            username,
            password,
            password_verify
        });

        // otherwise, check if the user account already exists
    } else {
        User.findOne({$or: [ { email: email }, { username: username } ]}).then(account => {
            if (account) {                                      // if it does, re-render as before
                errors.push({msg: 'Email or username already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    username,
                    password,
                    password_verify
                });

            } else {
                const newUser = new User({                  // else create the new account
                    name,
                    email,
                    username,
                    password
                });
                console.log('received: ' + newUser);
                // Use salting to encrypt the user password with bcrypt
                bcrypt.genSalt(10, (error, salt) =>
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;

                        newUser.password = hash;         // Encrypt the new user's password
                        newUser.save().then(account => { // Save the new user account
                            console.log(account);
                            console.log(newUser);
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
    //console.log(User);

    // Find the user account entered on the form
    User.findOne({ username: username }).then(account => {
        console.log(user);
        if (!account) {
            // If the account doesn't exist, push an error
            errors.push({ msg: 'Account does not exist. Please check you have entered it correctly, or register if you do not have an account' });

            res.render('login', {
                errors,
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


exports.logout = function(req, res, next) {
    req.logout();
    req.flash('success', 'You have successfully logged out');
    res.redirect('/login');
};


// TODO:
// - Implement dynamic user profiles system
// - Esure-authenticated -- edit profile
// - socket.io notification
// - modify User object to include avatar as field
// - merge first and last name into name -- change the forms
// - 