const Story = require('../models/story');

/** Function to create a user story */
exports.create = function (req, res) {
    let storyData = req.body;
    if (storyData == null) {
        res.status(403).send('No data sent!')
    }
    try {
        //TODO: Add Photo
        //TODO: req.user.username
        let story = new Story({
            event: storyData.eventname,
            user: storyData.username,
            date: storyData.date,
            time: storyData.time,
            story: storyData.story
        });
        console.log('received: ' + story);

        story.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(story));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


/**
 * Function to retrieve all the stories from the mongoose database
 */
exports.getStories = function getStories(req, res) {
    let eventName = req.body.name;
    console.log('fetching all stories for ' +eventName+ ' - mongoDB');
    //TODO: Add photo
    Story.find({event: eventName}, 'event story user date time', {sort: {date: -1, time:-1}}).exec(function (err, events) {
        if (err)
            console.log(err);
        res.send(events);
    });
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