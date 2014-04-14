var config = require(__dirname + '/../../config.json');

var passport = require('passport');
var utils = require(__dirname + '/utils');


var moment = require('moment');
var dateFormat = "dddd MM-DD-YYYY HH:mm:ss";

exports.getLogin = function(req, res) { 

	res.render('login.html', {
		config: config
	});
};

exports.postLogin =  function(req, res, next) { 

	passport.authenticate('local', function(err, user, info) {
		
		if (err) { return next(err) }
		
		if (!user) {
			req.session.errormessage = info.message;
			return res.redirect('/login');

			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + moment().format(dateFormat));
		}

		req.logIn(user, function(err) {
			if (err) { return next(err); }

			return res.redirect('/');

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + moment().format(dateFormat));
		});

	})(req, res, next);
};

exports.logout =  function(req, res) { 
	
	req.logout();
	res.redirect('/');
};