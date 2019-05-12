let mongoose = require('mongoose');

// Specify DB URL
var mongoDB = 'mongodb://localhost:27017/stories';

// Define DB promise
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

try {
    mongoose.storiesCon = mongoose.createConnection(mongoDB, { useNewUrlParser: true });
    console.log("connection to MongoDB complete!");
} catch (e) {
    console.log('error in connection: '+e.message)
}

module.exports = mongoose;