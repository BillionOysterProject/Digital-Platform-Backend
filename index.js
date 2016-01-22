
var express = require('express');
var app = express();

var env = require('./config/environments/dev.env.js'),
    environment = new env();
    
var passport = require('passport');

require('./config/express')(app);
require('./config/passport')(passport);
require("./app/routes")(app, passport);

app.listen(environment.port);
console.log('listening on port ' + environment.port)

exports = module.exports = app;