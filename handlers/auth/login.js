var config = require(__dirname + '/../../config.json');

var passport = require('passport');
var utils = require(__dirname + '/utils');

var User = require(__dirname + '/../../models/users/user')
var mongoose = require('mongoose');

var moment = require('moment');
var dateFormat = "dddd MM-DD-YYYY HH:mm:ss";

exports.getLogin = function(req, res, next) { 

	res.render('auth/login', { 
		user: req.user,
		config: config,
		errorMessage: req.session.errormessage
	});

	delete req.session.errormessage;

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

exports.ajaxLogin =  function(req, res, next) { 

  	passport.authenticate('local', function(err, user, info) {

		if (!user) { 

  			req.session.errormessage = info.message;			
			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + moment().format(dateFormat));
			
			res.contentType('json');
			res.send({ failure: info }); 
		}

		req.logIn(user, function(err) {

			
			if (err) { 
				req.session.errormessage = info.message;			
			
				console.log('Failed log in attempt by ' + req.body.username + ' () - ' + moment().format(dateFormat));
				
				res.contentType('json');
				res.send({ failure: info.message });
				return next(err);  
			}	

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + moment().format(dateFormat));	
				
			res.contentType('json');
			res.send({ success: 'success' }); 

		});

	})(req, res);
};