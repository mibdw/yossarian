var mongoose = require('mongoose');
var moment = require('moment');

var Change = require(__dirname + '/../models/change.js');

exports.list = function(req, res, next) {
	Change.find({})
	.sort('-date')
	.limit(req.body.limit)
	.skip(req.body.skip * req.body.limit)
	.populate('user', 'email name role picture department')
	.exec(function (err, data) {
		if (err) console.log(err);

		Change.count({}, function (err, count) {
			if (err) console.log(err);
			return res.send({'count': count, 'data': data });
		});
	});
};