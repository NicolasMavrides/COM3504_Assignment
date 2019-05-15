const mongoose = require('../databases/users');

var passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    }
});

UserSchema.plugin(passportLocalMongoose);
const User = mongoose.usersCon.model('User', UserSchema);

module.exports = User;