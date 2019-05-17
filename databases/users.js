let mongoose = require('mongoose');
// Specify DB URL
var mongoDB = 'mongodb://localhost:27017/users';

// Define DB promise
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

try {
    mongoose.usersCon = mongoose.createConnection(mongoDB, { useNewUrlParser: true });
    console.log("connection to Users MongoDB complete!");
} catch (e) {
    console.log('error in Users DB connection: '+e.message)
}

module.exports = mongoose;