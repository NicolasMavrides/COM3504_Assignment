/**
 * @param location TODO
 * @param user
 * @param event TODO associate to event class
 * @param date
 * @param time
 * @param story
 * @constructor
 */
class StoryObject{
    constructor (event, user, date, time, story) {
        this.event = event;
        this.user = user;
        this.date = date;
        this.time = time;
        this.story = story;
    }
}

exports.insert = function (req, res) {
    // create story object
    var storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        var story = new StoryObject(
            storyData.eventname,
            storyData.username,
            storyData.date,
            storyData.time,
            storyData.story
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(story));
    } catch (e) {
        res.status(500).send('error ' + e);
    }
}