const Event = require('../models/event');

/** Function to create an event */
exports.create = function (req, res) {
        let eventData = req.body;
        if (eventData == null) {
            res.status(403).send('No data sent!')
        }

        try {
            var event = new Event({
                name: eventData.name,
                date: eventData.date,
                description: eventData.description,
                latitude: eventData.latitude,
                longitude: eventData.longitude
            });
            console.log('received: ' + event);

            event.save(function (err, results) {
                console.log(results._id);
                if (err)
                    res.status(500).send('Invalid data!');

                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(event));
            });
        } catch (e) {
            res.status(500).send('error ' + e);
        }
};

/**
 * Function to retrieve an event (by id) from the mongoose database
 */
exports.getEvent = function (req, res) {
    console.log('fetching event by ID - mongoDB');
    var id = req.body.id;
    Event.find({_id: id}, 'name date description latitude longitude').exec(function (err, event) {
        if (err)
            console.log(err);
        res.send(event[0]);
    });
};

/**
 * Function to retrieve all the events from the mongoose database
 */
exports.getEvents = function (req, res) {
    console.log('fetching all events - mongoDB');
    Event.find({}, 'name date description', {sort: {date: -1}}).exec(function (err, events) {
        if (err)
            console.log(err);
        res.send(events);
    });
};

/**
 * Function to retrieve searched events from the mongoose database
 */
exports.search = function (req, res) {
    let eventData = req.body;
    console.log('searching for events - mongoDB');
    let find = {};
    if (eventData.name.length != 0 && eventData.date.length !=0){
            find = {name: eventData.name, date: eventData.date};
    } else {
        if(eventData.name.length != 0){
            find = {name: eventData.name};
        } else if (eventData.date.length != 0){
            find = {date: eventData.date};
        }
    }
    Event.find(find, 'name date description', {sort: {date: -1}}).exec(function (err, events) {
        if (err)
            console.log(err);
        res.send(events);
    });
};

/**
 * Function to retrieve searched events (by lat and long) from the mongoose database
 */
exports.searchMap = function (req, res) {
    let eventData = req.body;
    //find locations within 5km
    const distance = 5;
    // earth's radius in km = ~6371
    const radius = 6371;
    let lat = parseFloat(eventData.latitude);
    let lng = parseFloat(eventData.longitude);

    // latitude boundaries
    const maxlat = lat + radians_to_degrees(distance / radius);
    const minlat = lat - radians_to_degrees(distance / radius);

    // longitude boundaries (longitude gets smaller when latitude increases)
    const maxlng = lng + radians_to_degrees(distance / radius / Math.cos(degrees_to_radians(lat)));
    const minlng = lng - radians_to_degrees(distance / radius / Math.cos(degrees_to_radians(lat)));

    console.log('searching for events by location - mongoDB');
    Event.find({latitude: {$gte: minlat, $lte: maxlat}, longitude: {$gte: minlng, $lte: maxlng}}, 'name date latitude longitude', {sort: {date: -1}}).exec(function (err, events) {
        if (err)
            console.log(err);
        res.send(events);
    });
};

/** Function to open an event page given an event id*/
exports.open = function (req, res) {
    var id = req.params.event_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('events', { id: id, user: req.user});
    }
};

/** Helper functions for working out map radius*/
function radians_to_degrees(radians)
{
    var pi = Math.PI;
    return radians * (180/pi);
}

function degrees_to_radians(degrees)
{
    var pi = Math.PI;
    return degrees * (pi/180);
}