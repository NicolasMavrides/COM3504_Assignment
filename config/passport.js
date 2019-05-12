const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, result) => {
        // Check if the user account exists
            User.findOne({ username: username })
                .then(account => {
                    if (!account) {  // if user account doesn't exist..
                        return result(null, false, { message: 'User account does not exist.' }) // null for error, false for user account, msg for options
                    }

                    // if user account does exist, then check if the password is correct
                    bcrypt.compare(password, account.password, (error, isMatch) => {
                        if (error) throw error;
                        if (isMatch) {
                            // password correct
                            return result(null, account);  // null for error, account for the user account
                        } else {
                            // password incorrect
                            return result(null, false, { message: 'Password is incorrect' }) // null for error, false for account because login incorrect
                        }
                    });
                })
                .catch(error => console.log(error));
        })
    );

    passport.serializeUser((account, result) => {
        result(null, account.id);
    });

    passport.deserializeUser((id, result) => {
        User.findById(id, (error, account) => {
            result(error, account);
        });
    });

};