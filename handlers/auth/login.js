var pjson = require(__dirname + '/../../package.json');
var site_title = pjson.name;
var site_description = pjson.description;
var nav_menu = require(__dirname + '/../nav.json');
var passport = require('passport');
var now = new Date();
var utils = require('./utils');

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}

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

exports.ajaxlogin =  function(req, res, next) { 

  	passport.authenticate('local', function(err, user, info) {

		if (!user) { 

  			req.session.errormessage = info.message;			
			
			console.log('Failed log in attempt by ' + req.body.username + ' (' + info.message +') - ' + now.toJSON());
			
			res.contentType('json');
			res.send({ failure: info.message }); 
		}



		req.logIn(user, function(err) {

			if (err) { 
				req.session.errormessage = info.message;			
			
				console.log('Failed log in attempt by ' + req.body.username + ' (' + info.message +') - ' + now.toJSON());
				
				res.contentType('json');
				res.send({ failure: info.message });
				return next(err);  
			}

			if (req.body.remember_me) { 

			 	issueToken(user, function(err, token) {

			 		console_log(req.body.remember_me);
					
					res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
				});
			 }

			console.log('Succesfull login attempt by ' + req.body.username + ' - ' + now.toJSON());	
			res.contentType('json');
			res.send({ success: 'success' }); 

		});

	})(req, res);


};

