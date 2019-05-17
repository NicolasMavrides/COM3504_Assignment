var request = require('request');

exports.contact = function(req, res, loginRequired) {
    let redirect = true;
    if (!loginRequired) {
        redirect = false;
    } else {
        if(req.user){
            redirect = false;
        }
    }
    var headers = {
        'User-Agent': 'PWA',
        'Content-Type': 'application/json'
    };
    var options = {
        url: 'http://localhost:3001'+req.originalUrl,
        method: 'POST',
        headers: headers,
        json: req.body
    };

    if (!redirect){
        request(options, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log("Response from MongoServer:");
                console.log(body);
                res.send(JSON.stringify(body))
            }
            else {
                console.log('error:', error);
                res.status(500).send('error ' + error);
            }
        });
    }
    else {
        res.redirect('/login');
    }
};