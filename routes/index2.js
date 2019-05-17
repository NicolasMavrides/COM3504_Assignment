//Routes for the second server - handles communication with MongoDB

var express = require('express');
var router = express.Router();
var db = require('../controllers/db_init');

//////////////////// Events //////////////////

var events = require('../controllers/events');

router.post('/getEvent', events.getEvent);
router.post('/getEvents', events.getEvents);

/* GET an event */
router.get('/events/:event_id', events.open);

/* POST the Event form */
router.post('/post_event', events.create);

/////////////////// Stories //////////////////////

var stories = require('../controllers/stories');

router.post('/getStories', stories.getStories);

/* GET a story */
router.get('/stories/:story_id', stories.open);

/* POST the Story form */
router.post('/post_story', stories.create);

/* GET Not Found page */
router.get('/not_found', function(req, res, next) {
    res.render('not_found');
});

//////////////////// Comments ////////////////////

var comments = require('../controllers/comments');

router.post('/getComments', comments.getComments);

/* POST the comment form */
router.post('/post_comment', comments.create);

//////////////////// Search /////////////////////

/* POST the search form */
router.post('/search_event', events.search);

/* POST the map  form */
router.post('/search_map', events.searchMap);

module.exports = router;
