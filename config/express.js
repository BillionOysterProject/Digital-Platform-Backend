var express = require('express'),
	corser = require('corser'),
	bodyParser = require('body-parser');

module.exports = function (app) {

	app.use(bodyParser())

	app.use(corser.create());

}
