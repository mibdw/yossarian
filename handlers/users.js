var mongoose = require('mongoose');
var moment = require('moment');

function slugify (text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

var User = require(__dirname + '/../models/user.js');

exports.create = function(req, res, next) {
	
	var user = new User(req.body);
	user.save(function (err) {
		if (err) return console.log(err);
		return res.send('success');
	});

	// SAVE BIRTHDAY AS EVENT
};

exports.remove = function(req, res, next) {

};

exports.update = function(req, res, next) {

};

exports.detail = function(req, res, next) {

	console.log(req.body);
	User.findById(req.body._id, function (err, userData) {
		if (err) console.log(err);
		return res.send(userData);
	});
};

exports.list = function(req, res, next) {
	
	User.find({})
	.select('_id email name')
	.exec(function (err, userList) {
		if (err) console.log(err);
		return res.send(userList);
	});
};