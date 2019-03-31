/**
 * @param name
 * @param date
 * @param description
 * @param latitude
 * @param longitude
 * @constructor
 */
class EventsObject{
    constructor (name, date, description, latitude, longitude) {
        this.name = name;
        this.date = date;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude
    }
}

/** Function to create an event */
exports.create = function (req, res) {
    var eventData = req.body;
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        // Create an event object
        var event = new EventsObject(
            eventData.name,
            eventData.date,
            eventData.description,
            eventData.latitude,
            eventData.longitude
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(event));
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


/** Function to create a open an event page given an event id*/
exports.open = function (req, res) {
    var id = req.params.event_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('events', { id: id });
    }
};