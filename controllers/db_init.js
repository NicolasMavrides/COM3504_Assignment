var User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.init_sample = function() {

    // remove any pre-existing init DB items to avoid duplication
    User.deleteOne({ username: 'TStark12' }, function(error) {
        console.log('pre-existing DB items removed');
    });

    User.deleteOne({ username: 'DrStrange' }, function(error) {
        console.log('pre-existing DB items removed');
    });

    // Create 2 sample users for Database init
    const IronMan = new User({                  // else create the new account
        name: 'Tony Stark',
        email: 'tstark@gmail.com',
        username: 'TStark12',
        password: 'Password'
    });

    const DrStrange = new User({
        name: 'Stephen Vincent Strange',
        email: 'svstrange@gmail.com',
        username: 'DrStrange',
        password: 'Password'
    });

    // Use salting to encrypt sample passwords
    bcrypt.genSalt(10, (error, salt) =>
        bcrypt.hash('IronManPassword', salt, (error, hash_1) => {
            if (error) throw error;
            IronMan.password = hash_1;
        })
    );

    bcrypt.genSalt(10, (error, salt) =>
        bcrypt.hash('DrStrangePassword', salt, (error, hash_2) => {
            if (error) throw error;
            DrStrange.password = hash_2;
        })
    );

    // Save the sample accounts
    IronMan.save(function(error, res) {
        console.log(res._id);
    });

    DrStrange.save(function(error, res) {
        console.log(res._id);
    });
};