var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');

module.exports = function (app, res, req) {

	app.get('/', ensureAuthenticated, function(req, res){
		res.render('main.html');
	});

	// AUTHENTICATION
	
	app.get('/login', function(req, res){
		res.render('login.html', { user: req.user, message: req.session.messages });
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) { return next(err) }
			if (!user) {
				req.session.messages = [info.message];
				return res.redirect('/login');
			}
			req.logIn(user, function(err) {
				if (err) { return next(err); }
				req.session.messages = "";
				console.log(moment().format(dateFormat) + ' - Succesvolle login door ' + user.username );
				return res.redirect('/');
			});
		})(req, res, next);
	});

	app.get('/logout', ensureAuthenticated, function(req, res){
	console.log(moment().format(dateFormat) + ' - Succesvolle logout door ' + req.user.username );
	req.logout();
	res.redirect('/');
	});

};


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}