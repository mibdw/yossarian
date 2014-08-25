var mongoose = require('mongoose');
var moment = require('moment');

var User = require(__dirname + '/../models/user.js');

exports.create = function(req, res, next) {
	var user = new User({ 
		email: req.body.email,
		password: req.body.password,
		name: {
			first: req.body.name.first,
			last: req.body.name.last
		},
		role: req.body.role,
		avatar: req.body.avatar,
		birthday: req.body.birthday,
		department: req.body.department,
		note: req.body.note,
		active: req.body.active
	});
	
	user.save(function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - New user created: ' + user.email + ".");
		}
	});

	// SAVE BIRTHDAY AS EVENT
};

exports.remove = function(req, res, next) {

};

exports.update = function(req, res, next) {

};

exports.detail = function(req, res, next) {

};

exports.list = function(req, res, next) {

};