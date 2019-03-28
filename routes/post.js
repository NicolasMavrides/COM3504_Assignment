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

module.exports = router;
