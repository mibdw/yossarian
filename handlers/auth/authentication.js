var config = require(__dirname + '/../../config.json');

var passport = require('passport');
var utils = require(__dirname + '/utils');

var moment = require('moment');
var dateFormat = "ddd MM-DD-YYYY HH:mm:ss";

exports.getLogin = function(req, res) { 

	res.render('login.html', {
		config: config,
		message: req.session.message
	});

	delete req.session.message;
};

exports.postLogin =  function(req, res, next) { 

	passport.authenticate('local', function(err, user, info) {
		
		if (err) { return next(err) }
		
		if (!user) {

			console.log(moment().format(dateFormat) + ' - Failed log in attempt by ' + req.body.username + ' (' + info.message + ')');
			req.session.message = info.message;

			return res.redirect('/login');
		}

		req.logIn(user, function(err) {

			if (err) { 

				console.log(moment().format(dateFormat) + ' - Failed log in attempt by ' + req.body.username + ' (' + info.message + ')');
				req.session.message = info.message;
				return next(err); 
			}

			console.log(moment().format(dateFormat) + ' - Succesfull login attempt by ' + req.body.username);
			return res.redirect('/');
			
		});

	})(req, res, next);
};

exports.ajaxLogin =  function(req, res, next) { 

	passport.authenticate('local', function(err, user, info) {
		
		if (err) { return next(err) }
		
		if (!user) {

			console.log(moment().format(dateFormat) + ' - Failed log in attempt by ' + req.body.username + ' (' + info.message + ')');
			req.session.message = info.message;

			return res.send({ failure: info.message });
		}

		req.logIn(user, function(err) {

			if (err) { 

				console.log(moment().format(dateFormat) + ' - Failed log in attempt by ' + req.body.username + ' (' + info.message + ')');
				req.session.message = info.message;
				return res.send({ failure: info.message });
			}

			console.log(moment().format(dateFormat) + ' - Succesfull login attempt by ' + req.body.username);
			return res.send({ success: 'Success!' });
			
		});

	})(req, res, next);
};

exports.logout =  function(req, res) { 
	console.log(moment().format(dateFormat) + ' - A moment of silence please, because ' + req.session.passport.user + ' logged out');
	req.logout();
	res.redirect('/');
};