var mongoose = require('mongoose');
var moment = require('moment');

function slugify (text) {
	return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

var User = require(__dirname + '/../models/user.js');

exports.create = function(req, res, next) {
	var user = new User(req.body);
	user.save(function (err, user) {
		if (err) return console.log(err);
		return res.send(user);
	});

	// SAVE BIRTHDAY AS EVENT
};

exports.remove = function(req, res, next) {
	User.findByIdAndRemove(req.body.remove, function (err) {
		if (err) return console.log(err);
		res.send('success');
	});
};

exports.update = function(req, res, next) {
	User.findById(req.body._id, function (err, user) {
		if (err) console.log(err);
		if (user) {
			user.name = req.body.name;
			user.password = req.body.password;
			user.role = req.body.role;
			user.birthday = req.body.birthday;
			user.department = req.body.department;
			user.note = req.body.note;
			user.active = req.body.active;

			user.save(function (err) {
				if (err) console.log(err);
				return res.send(user);
			});
		}
	});
};

exports.avatar = function(req, res, next) {
	User.findByIdAndUpdate(req.body._id, { $set: { 'picture': req.files.file.name }}, function (err, user) {
		if (err) console.log(err);
		return res.send(user);
	});
};

exports.detail = function(req, res, next) {
	User.findById(req.body._id)
	.select('-password')
	.exec(function (err, userData) {
		if (err) console.log(err);
		return res.send(userData);
	});
};

exports.list = function(req, res, next) {
	User.find({})
	.select('_id email name postDate picture')
	.exec(function (err, userList) {
		if (err) console.log(err);
		return res.send(userList);
	});
};

exports.user = function(req, res, next) {
	User.findOne({ 'email': req.user.email })
	.select('email name role picture department birthday')
	.exec(function (err, userData) {
		if (err) console.log(err);
		return res.send(userData);
	});
};