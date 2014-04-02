var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');

var passport = require('passport');
var utils = require(__dirname + '/utils');
var Token = require(__dirname + '/../../models/token')
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
			req.session.errormessage = info;
			return res.redirect('/login');

			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
		}

		req.logIn(user, function(err) {
			if (err) { return next(err); }

			if (req.body.remember_me) {

				var token = utils.randomString(64);
				Token.save(token, { userId: req.user.id }, function(err) {
					if (err) { return done(err); }
					res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
				});
			}

			return res.redirect('/');

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + now.toJSON());
		});

	})(req, res, next);

};

exports.ajaxlogin =  function(req, res, next) { 

  	passport.authenticate('local', function(err, user, info) {

		if (!user) { 

  			req.session.errormessage = info;			
			console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
			
			res.contentType('json');
			res.send({ failure: info }); 
		}

		req.logIn(user, function(err) {

			if (err) { 
				req.session.errormessage = info;			
			
				console.log('Failed log in attempt by ' + req.body.username + ' () - ' + now.toJSON());
				
				res.contentType('json');
				res.send({ failure: info });
				return next(err);  
			}

			if (req.body.remember_me) {

				var token = utils.randomString(64);
				Token.save(token, { userId: req.user.id }, function(err) {
					
					res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
				});
			}

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + now.toJSON());	
			res.contentType('json');
			res.send({ success: 'success' }); 

		});

	})(req, res);


};

