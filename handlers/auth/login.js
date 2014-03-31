var pjson = require('../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require('../nav.json');
var passport = require('passport');

exports.getlogin =  function(req, res) { 

	res.render('sections/login', { 
		user : req.user,
		site_title : site_title,
		site_description : site_description,
		nav_menu: nav_menu,
		error_message: req.session.errormessage
	});
	delete req.session.errormessage;

};

exports.postlogin =  function(req, res) { 
	
	passport.authenticate('local', function(err, user, info) {

		if (err) { return next(err); }

		if (!user) { 

			req.session.errormessage = info.message;
			return res.redirect('/login');  
		}

		req.logIn(user, function(err) {
			if (err) { 
				return next(err);
			}
		
			return res.redirect('/');
		});

	})(req, res);

};