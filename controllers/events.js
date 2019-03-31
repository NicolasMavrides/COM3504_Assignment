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

exports.create = function (req, res) {
    // create event object
    var eventData = req.body;
    console.log(eventData);
    if (eventData == null) {
        res.status(403).send('No data sent!')
    }
    try {
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

exports.open = function (req, res) {
    // Open an event object
    var id = req.params.event_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('events', { id: id });
    }
};