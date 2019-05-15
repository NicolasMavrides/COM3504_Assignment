const Story = require('../models/story');
const fs = require('fs');

/** Function to create a user story */
exports.create = function (req, res) {
    if (req.user) {
        console.log(req.body);
        let storyData = req.body;
        if (storyData == null) {
            res.status(403).send('No data sent!')
        }
        try {
            uploadImage(req.user.username, storyData.image).then((filePath) => {
                console.log(filePath);
                let story = new Story({
                    event: storyData.eventname,
                    user: storyData.username,
                    date: storyData.date,
                    time: storyData.time,
                    story: storyData.story,
                    photo: filePath
                });
                console.log('received: ' + story);

                story.save(function (err, results) {
                    console.log(results._id);
                    if (err)
                        res.status(500).send('Invalid data!');

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(story));
                });
            });
        } catch (e) {
            res.status(500).send('error ' + e);
        }
    } else {
        res.redirect('/login');
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

function uploadImage(user, image){
    return new Promise((resolve, reject) => {
        targetDirectory = './private/images/' + user + '/';
        var filePath = targetDirectory + new Date().getTime();
        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory);
        }
        console.log('saving file ' + filePath);
        // strip off the data: url prefix to get just the base64-encoded bytes
        var imageBlob = image.replace(/^data:image\/\w+;base64,/, "");
        var buf = Buffer.from(imageBlob, 'base64');
        fs.writeFile(filePath + '.png', buf, (err) => {
            if (err) {
                reject();
                console.log(err);
            }
            console.log('The file has been saved!');
            resolve(filePath);
        });
    });
}