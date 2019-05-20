 var express = require('./config/express');
 var server = express();

var config = require('./config/config')

var mongo=require('./config/mongoose')();

server.listen(config.port)
console.log("Your Port Number:"+config.port)

