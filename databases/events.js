let mongoose = require('mongoose');

// Specify DB URL
var mongoDB = 'mongodb://localhost:27017/events';

// Define DB promise
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

try {
    mongoose.eventsCon = mongoose.createConnection(mongoDB, { useNewUrlParser: true });
    console.log("connection to Events MongoDB complete!");
} catch (e) {
    console.log('error in Events DB connection: '+e.message)
}

module.exports = mongoose;