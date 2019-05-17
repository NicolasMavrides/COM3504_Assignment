let mongoose = require('mongoose');

// Specify DB URL
var mongoDB = 'mongodb://localhost:27017/comments';

// Define DB promise
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

try {
    mongoose.commentsCon = mongoose.createConnection(mongoDB, { useNewUrlParser: true });
    console.log("connection to Comments MongoDB complete!");
} catch (e) {
    console.log('error in Comments DB connection: '+e.message)
}

module.exports = mongoose;