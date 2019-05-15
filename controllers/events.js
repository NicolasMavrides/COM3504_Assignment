const Event = require('../models/event');

/** Function to create an event */
exports.create = function (req, res) {
    if (req.user) {
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
    } else {
        res.redirect('/login');
    }
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
 * TODO:
 */
exports.search = function (req, res) {
    let eventData = req.body;
    console.log('searching for events - mongoDB');
    let find = {};
    console.log(eventData.name);
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