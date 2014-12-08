var mongoose = require('mongoose');
var moment = require('moment');

var Change = require(__dirname + '/../models/change.js');

exports.list = function(req, res, next) {
	Change.find({})
	.sort('-date')
	.limit(10)
	.populate('user', 'email name role picture department')
	.exec(function (err, data) {
		if (err) console.log(err);
		return res.send(data);
	});
};