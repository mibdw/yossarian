var mongoose = require('mongoose');
var moment = require('moment');

var Event = require(__dirname + '/../models/event.js');

exports.create = function(req, res, next) {
	var createEvent = new Event(req.body);
	createEvent.save(function (err, eventData) {
		if (err) return console.log(err);
		return res.send(eventData);
	});
};

exports.remove = function(req, res, next) {
	Event.findByIdAndRemove(req.body.remove, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};

exports.update = function(req, res, next) {
	Event.findByIdAndUpdate(req.body._id, { $set: req.body }, function (err, eventData) {
		if (err) console.log(err);
		return res.send(eventData);
	});
};

exports.detail = function(req, res, next) {
	Event.findById(req.body._id)
	.populate('user editor', 'email name role picture department')
	.populate('category')
	.exec(function (err, eventData) {
		if (err) console.log(err);	
		return res.send(eventData);
	});
};

exports.list = function(req, res, next) {
	if (req.body.categories && req.body.categories.length > 0) {
		Event.find({})
		.where('start').gt(req.body.start).lt(req.body.end)
		.where('category').in(req.body.categories)
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, eventData) {
			if (err) console.log(err);	
			return res.send(eventData);
		});
	} else {
		Event.find({})
		.where('start').gt(req.body.start).lt(req.body.end)
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, eventData) {
			if (err) console.log(err);	
			return res.send(eventData);
		});
	}
};