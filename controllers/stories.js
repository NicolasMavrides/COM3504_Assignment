/**
 * @param location TODO
 * @param username
 * @param event TODO associate to event class
 * @param date
 * @param time
 * @param story
 * @constructor
 */
class StoryObject{
    constructor (event, user, date, time, story, photo) {
        this.event = event;
        this.user = user;
        this.date = date;
        this.time = time;
        this.story = story;
        this.photo = photo;
    }
}

exports.create = function (req, res) {
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
            storyData.story,
            storyData.photo
        );
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(story));
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};

exports.open = function (req, res) {
    // Open an event object
    var id = req.params.story_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('stories', { id: id });
    }
};