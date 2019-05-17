var request = require('request');

/**
 * Function to contact the second NodeJS
 * This second server handles interactions with MongoDB
 */
exports.contact = function(req, res, loginRequired) {
    let redirect = true;
    if (!loginRequired) {
        redirect = false;
    } else {
        if(req.user){
            redirect = false;
        }
    }
    const headers = {
        'User-Agent': 'PWA',
        'Content-Type': 'application/json'
    };
    let options = {
        url: 'http://localhost:3001'+req.originalUrl,
        method: 'POST',
        headers: headers,
        json: req.body
    };

    options.json.currentUser = req.user;
    if (redirect){
        res.redirect('/login');
    }
    else {
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
};