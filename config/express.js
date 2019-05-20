var express = require('express'),
    bodyParser = require('body-parser');

module.exports = function () {
    var app = express();
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.all('/', function (req, res) {

        res.send("<p>Server is working</p>")

    })

    require('../app/routes')(app);

    return app;

}