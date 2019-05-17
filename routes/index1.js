//Routes for the main server

var express = require('express');
var router = express.Router();
var db = require('../controllers/db_init');
var mongoServer = require('../controllers/mongoServer');

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

router.post('/getEvent', function (req, res) {
    mongoServer.contact(req, res, false);
});

router.post('/getEvents', function (req, res) {
    mongoServer.contact(req, res, false);
});

/* GET events form */
router.get('/create_event', function(req, res, next) {
    if (req.user) {
        res.render('event_form', { user : req.user });
    } else {
        res.redirect('/login');
    }
});

/* GET an event */
router.get('/events/:event_id', events.open);

/* POST the Event form */
router.post('/post_event', function (req, res) {
    mongoServer.contact(req, res, true);
});

/////////////////// Stories //////////////////////

var stories = require('../controllers/stories');

router.post('/getStories', function (req, res) {
    mongoServer.contact(req, res, false);
});

/* GET stories form */
router.get('/create_story', function(req, res, next) {
    if (req.user){
        res.render('story_form', { user : req.user });
    } else {
        res.redirect('/login');
    }
});

/* GET a story */
router.get('/stories/:story_id', stories.open);

/* POST the Story form */
router.post('/post_story', function (req, res) {
    console.log('posting');
    console.log(req.body);
    mongoServer.contact(req, res, true);
});

/* GET Not Found page */
router.get('/not_found', function(req, res, next) {
    res.render('not_found');
});

//////////////////// Comments ////////////////////

router.post('/getComments', function (req, res) {
    mongoServer.contact(req, res, false);
});

/* POST the comment form */
router.post('/post_comment', function (req, res) {
    mongoServer.contact(req, res, true);
});

//////////////////// Search /////////////////////

/* GET the search form */
router.get('/search', function(req, res, next) {
    res.render('search', { user : req.user });
});

/* POST the search form */
router.post('/search_event', function (req, res) {
    mongoServer.contact(req, res, false);
});

/* POST the map  form */
router.post('/search_map', function (req, res) {
    mongoServer.contact(req, res, false);
});

module.exports = router;
