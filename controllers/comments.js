const Comment= require('../models/comment');

/** Function to create a comment */
exports.create = function (req, res) {
    console.log(req.body);
    let commentData = req.body;
    if (commentData == null) {
        res.status(403).send('No data sent!')
    }

    try {
        let comment = new Comment({
            event: commentData.id,
            user: req.user.username,
            comment: commentData.comment,
            date: new Date().getTime()
        });
        console.log('received: ' + comment);

        comment.save(function (err, results) {
            console.log(results._id);
            if (err)
                res.status(500).send('Invalid data!');

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(comment));
        });
    } catch (e) {
        res.status(500).send('error ' + e);
    }
};


/**
 * Function to retrieve comments from the mongoose database
 */
exports.getComments = function (req, res) {
    let eventID= req.body.id;
    console.log('fetching all comments for ' +eventID+ ' - mongoDB');
    Comment.find({event: eventID}, 'user comment date', {sort: {date: -1}}).exec(function (err, comments) {
        if (err)
            console.log(err);
        res.send(comments);
    });
};