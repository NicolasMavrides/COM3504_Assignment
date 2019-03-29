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
<<<<<<< HEAD:controllers/post.js
    constructor (event, user, date, time, story, photo) {
=======
    constructor (event, username, date, time, story) {
>>>>>>> b383500454112d32496e921f835c8c75bf6a8f23:controllers/stories.js
        this.event = event;
        this.username = username;
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