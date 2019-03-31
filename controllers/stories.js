/**
 * @param username
 * @param event
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

/** Function to create a user story */
exports.create = function (req, res) {
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

/** Function to open a user story page given its id*/
exports.open = function (req, res) {
    var id = req.params.story_id;
    console.log(id);
    if (id == null) {
        res.status(403).send('No data sent!')
    } else {
        res.render('stories', { id: id });
    }
};