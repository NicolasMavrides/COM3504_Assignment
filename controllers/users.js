// var fs = require('fs-extra'); Seems to be unneeded for now
const User = require('../models/user');
const bcrypt = require('bcryptjs');


/**
 * @param firstname
 * @param lastname
 * @param email
 * @param username
 * @param password
 * @constructor
 */

/* class UserObject {
    constructor (firstname, lastname, email, username, password, password_verify) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.password_verify = password_verify;
    }
}
*/

exports.createAccount = function(req, res) {
    const {firstname, lastname, email, username, password, password_verify} = req.body;
    let errors = [];

    // Validation checks on field completion and password matching
    if (!firstname || !lastname || !email || !username || !password || !password_verify) {
        errors.push({ msg: 'You have left one or more fields empty. Please make sure to fill in all fields!' });
    } else if (password.length < 5) {
        errors.push({ msg: 'Password cannot be less than 5 characters long.' });
    } else if (password !== password_verify) {
        errors.push( {msg: 'Passwords entered do not match, please try again.' });
    }

    // Check if any errors exist. Re-render form with entered data (minus passwords) if there is
    if (errors.length > 0) {
        res.render('register', {
            errors,
            firstname,
            lastname,
            email,
            username,
            password,
            password_verify
        });

        // otherwise, check if the user account already exists
    } else {
        User.findOne({$or: [ { email: email }, { username: username } ]}).then(user => {
            if (user) {                                      // if it does, re-render as before
                errors.push({msg: 'Email or username already exists'});
                res.render('register', {
                    errors,
                    firstname,
                    lastname,
                    email,
                    username,
                    password,
                    password_verify
                });

            } else {
                const newUser = new User({                  // else create the new account
                    firstname,
                    lastname,
                    email,
                    username,
                    password
                });
                console.log('received: ' + newUser);
                // Use salting to encrypt the user password with bcrypt
                bcrypt.genSalt(10, (error, salt) =>
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;

                        newUser.password = hash;      // Encrypt the new user's password
                        newUser.save( // Save the new user account
                            function (err, results) {
                                console.log(results._id);
                                if (err)
                                    res.status(500).send('Invalid data!');
                                res.redirect('/');
                            });
                    })
                );
            }
        });
    }
};



exports.login = function(req, res) {

};

// Read sample users from json file
//var jsonData = JSON.parse(fs.readFileSync('./sample_users.json'));
//console.log(jsonData);


/* Unneeded for now...
/** Function to create a user
 * Adds a new user to the json file
 *
exports.create = function(req, res) {
    // create user object
    var userData = req.body;
    if (userData == null) {
        res.status(403).send('No data sent!')
    }

    /*
    try {
        var newUser = new UserObject(userData.firstname, userData.lastname, userData.email, userData.username, userData.password);
        var newUserData = { firstname:newUser.firstname, lastname:newUser.lastname, email:newUser.email, username:newUser.username, password:newUser.password };

        jsonData.push(newUserData);
        console.log(jsonData);
        res.redirect('/');

    } catch (e) {
        res.status(500).send('error ' + e);
    }

};

//exports.list = jsonData;
*/