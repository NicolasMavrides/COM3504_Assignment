var fs = require('fs-extra');

/**
 * @param firstname
 * @param lastname
 * @param email
 * @param username
 * @param password
 * @constructor
 */
class UserObject{
    constructor (firstname, lastname, email, username, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.username = username;
        this.password = password;
    }
}


var jsonData = JSON.parse(fs.readFileSync('./sample_users.json'));
console.log(jsonData);

exports.create = function (req, res) {

}