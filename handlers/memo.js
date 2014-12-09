var mongoose = require('mongoose');
var moment = require('moment');

var Memo = require(__dirname + '/../models/memo.js');

exports.create = function(req, res, next) {
	var memo = new Memo({ 'body': req.body.memo, 'author': req.user._id });
	memo.save(function (err, memoData) {
		if (err) return console.log(err);
		return res.send(memoData);
	});
};

exports.remove = function(req, res, next) {
	Memo.findByIdAndRemove(req.body.remove, function (err) {
		if (err) return console.log(err);
		return res.send('success');
	});
};

exports.list = function(req, res, next) {
	Memo.find({})
	.sort('-date')
	.limit(req.body.limit)
	.skip(req.body.skip * req.body.limit)
	.populate('author', 'email name role picture department')
	.exec(function (err, data) {
		if (err) return console.log(err);

		Memo.count({}, function (err, count) {
			if (err) console.log(err);
			return res.send({'count': count, 'data': data });
		});
	});
};