var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'My Class', login_is_correct: true });
});

/* POST from form. */
router.post('/login', function(req, res, next) {
    var login= req.body.username;
    var password= req.body.password;

    if (login=='nicolas' || login== 'idris'){
        res.render('index', { title: login,  login_is_correct: true });
    } else {
        res.render('login', { title: 'My Class', login_is_correct: false });
    }

});

module.exports = router;
