var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');

exports.login = function(req, res, next) {
	res.render('login.html', { user: req.user, message: req.session.messages });
};

exports.logout = function(req, res, next) {
	console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - Succesfull logout by ' + req.user.email );
	req.logout();
	res.redirect('/');
};

exports.entry = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err) }
		if (!user) {
			req.session.messages = [info.message];
			return res.redirect('/login');
		}
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			req.session.messages = "";	
			console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - Succesfull login by ' + user.email );
			return res.redirect('/');
		});
	})(req, res, next);
};