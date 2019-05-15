var express = require('express');
var router = express.Router();
var db = require('../controllers/db_init');

db.init_sample();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { user : req.user});
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { user : req.user });
});

//////////////////// Events //////////////////

var events = require('../controllers/events');

router.post('/getEvents', events.getEvents);

/* GET events form */
router.get('/create_event', function(req, res, next) {
  res.render('event_form', { user : req.user });
});

/* GET the search form */
router.get('/search', function(req, res, next) {
    res.render('search', { user : req.user });
});

/* GET an event */
router.get('/events/:event_id', events.open);

/* POST the Event form */
router.post('/post_event', events.create);

/* POST the search form */
router.post('/search_event', events.search);


/////////////////// Stories //////////////////////

var stories = require('../controllers/stories');

router.post('/getStories', stories.getStories);

/* GET stories form */
router.get('/create_story', function(req, res, next) {
  res.render('story_form', { user : req.user });
});

/* GET a story */
router.get('/stories/:story_id', stories.open);

/* POST the Story form */
router.post('/post_story', stories.create);

/* GET Not Found page */
router.get('/not_found', function(req, res, next) {
  res.render('not_found');
});

module.exports = router;
