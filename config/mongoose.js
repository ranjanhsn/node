var mongoose = require('mongoose');
var config = require("./config");

module.exports = function () {
    mongoose.connect(config.db, function (err, data) {
        if (!err) {
            console.log("database connected");

        }
        else {
            console.log("error");
        }
    })
}