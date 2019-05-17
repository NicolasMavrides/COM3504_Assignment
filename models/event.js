const mongoose = require('../databases/events');

//Mongoose Schema for an Event
const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});

const Event = mongoose.eventsCon.model('Event', EventSchema);

module.exports = Event;