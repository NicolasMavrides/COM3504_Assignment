var express = require('express');
var router = express.Router();

var post = require('../controllers/post');

/* GET stories form. */
router.get('/create_post', function(req, res, next) {
    res.render('create_post');
});

/**
 *  POST the story data.
 */

router.post('/create_story', post.insert);

router.post('/uploadpicture_app',
    function (req, res) {
        var userId= req.body.userId;
        var newString = new Date().getTime();
        targetDirectory = './private/images/' + userId + '/';
        if (!fs.existsSync(targetDirectory)) {
            fs.mkdirSync(targetDirectory);
        }
        console.log('saving file ' + targetDirectory + newString);

        // strip off the data: url prefix to get just the base64-encoded bytes
        var imageBlob = req.body.imageBlob.replace(/^data:image\/\w+;base64,/,
            "");
        var buf = new Buffer(imageBlob, 'base64');
        fs.writeFile(targetDirectory + newString + '.png', buf);
        var filePath = targetDirectory + newString;
        console.log('file saved!');
        var data = {user: userId, filePath: filePath};
        var errX = pictureDB.insertImage(data);
        if (errX) {
            console.log('error in saving data: ' + err);
            return res.status(500).send(err);
        } else {
            console.log('image inserted into db');
        }
        res.end(JSON.stringify({data: ''}));
});

module.exports = router;
