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

/** Function to open an event page given an event id*/
exports.open = function (req, res) {
    var id = req.params.event_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('events', { id: id });
    }
};