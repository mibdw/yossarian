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
	.populate('author editor', 'email name role picture department')
	.exec(function (err, eventData) {
		if (err) console.log(err);	
		return res.send(eventData);
	});
};

exports.list = function(req, res, next) {
	if (req.body.categories && req.body.categories.length > 0) {
		Event.find({})
		.or([
			{ start: { $gt: req.body.start, $lte: req.body.end }}, 
			{ end: { $gt: req.body.start, $lte: req.body.end }}, 
			{ start: { $lt: req.body.start }, end: { $gt: req.body.end }}
		])
		.where('category').in(req.body.categories)
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, eventData) {
			if (err) console.log(err);	
			return res.send(eventData);
		});
	} else {
		Event.find({})
		.or([
			{ start: { $gt: req.body.start, $lte: req.body.end }}, 
			{ end: { $gt: req.body.start, $lte: req.body.end }}, 
			{ start: { $lt: req.body.start }, end: { $gt: req.body.end }}
		])
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, eventData) {
			if (err) console.log(err);	
			return res.send(eventData);
		});
	}
};

exports.upcoming = function(req, res, next) {

	var yesterday = moment().subtract('1', 'day');
	if (req.body.categories && req.body.categories.length > 0) {
		Event.find({})
		.or([
			{ start: { $gt: yesterday }},
			{ start: { $lt: yesterday }, end: { $gt: yesterday } }
		])
		.where('category').in(req.body.categories)
		.sort('start')
		.limit(10)
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, upcomingData) {
			if (err) console.log(err);
			return res.send(upcomingData);
		});
		
	} else {
		Event.find({})
		.or([
			{ start: { $gt: yesterday }},
			{ start: { $lt: yesterday }, end: { $gt: yesterday } }
		])
		.sort('start')
		.limit(10)
		.populate('author editor', 'email name role picture department')
		.populate('category')
		.exec(function (err, upcomingData) {
			if (err) console.log(err);
			return res.send(upcomingData);
		});
	}
};