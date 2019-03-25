var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'My Class', login_is_correct: true });
});

/* POST from form. */
router.post('/register', function(req, res, next) {
    //var login= req.body.login;
    //var password= req.body.password;
    // Other vars here related to user information...

    // When user hits submit, validate information and add to database tables etc.

});

module.exports = router;
