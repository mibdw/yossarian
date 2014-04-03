var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');

var passport = require('passport');
var utils = require(__dirname + '/utils');

var User = require(__dirname + '/../../models/user')
var mongoose = require('mongoose');

var now = new Date();


exports.getlogin = function(req, res, next) { 

	res.render('sections/login', { 
		user : req.user,
		site_title : site_title,
		site_description : site_description,
		nav_menu: nav_menu,
		error_message: req.session.errormessage
	});

	delete req.session.errormessage;

};

exports.postlogin =  function(req, res, next) { 

	passport.authenticate('local', function(err, user, info) {
		
		if (err) { return next(err) }
		
		if (!user) {
			req.session.errormessage = info.message;
			return res.redirect('/login');

			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
		}

		req.logIn(user, function(err) {
			if (err) { return next(err); }

			return res.redirect('/');

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + now.toJSON());
		});

	})(req, res, next);

};

exports.ajaxlogin =  function(req, res, next) { 

  	passport.authenticate('local', function(err, user, info) {

		if (!user) { 

  			req.session.errormessage = info.message;			
			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
			
			res.contentType('json');
			res.send({ failure: info }); 
		}

		req.logIn(user, function(err) {

			
			if (err) { 
				req.session.errormessage = info.message;			
			
				console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
				
				res.contentType('json');
				res.send({ failure: info.message });
				return next(err);  
			}	

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + now.toJSON());	
				
			res.contentType('json');
			res.send({ success: 'success' }); 


		});

	})(req, res);
};