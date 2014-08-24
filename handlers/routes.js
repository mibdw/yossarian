var passport = require('passport');
var mongoose = require('mongoose');
var moment = require('moment');

module.exports = function (app, res, req) {

	app.get('/', ensureAuthenticated, function(req, res){
		res.render('main.html');
	});
	
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
				console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - Succesfull login by ' + user.email );
				return res.redirect('/');
			});
		})(req, res, next);
	});

	app.get('/logout', ensureAuthenticated, function(req, res){
		console.log(moment().format('YYYY-MM-DD HH:mm:ss') + ' - Succesfull logout by ' + req.user.email );
		req.logout();
		res.redirect('/');
	});

	app.get('/partials/:section/:partial', function(req, res) {
		res.render("partials/" + req.params.section + "/" + req.params.partial + ".html");
	});

	var users = require(__dirname + '/users.js');
	app.post('/users/create', ensureAuthenticated, users.create);
	app.post('/users/remove', ensureAuthenticated, users.remove);
	app.post('/users/update', ensureAuthenticated, users.update);
	app.post('/users/detail', ensureAuthenticated, users.detail);
	app.post('/users/list', ensureAuthenticated, users.list);

	var categories = require(__dirname + '/categories.js');
	app.post('/categories/create', ensureAuthenticated, categories.create);
	app.post('/categories/remove', ensureAuthenticated, categories.remove);
	app.post('/categories/update', ensureAuthenticated, categories.update);
	app.post('/categories/detail', ensureAuthenticated, categories.detail);
	app.post('/categories/list', ensureAuthenticated, categories.list);

	var memo = require(__dirname + '/memo.js');
	app.post('/memo/create', ensureAuthenticated, memo.create);
	app.post('/memo/remove', ensureAuthenticated, memo.remove);
	app.post('/memo/update', ensureAuthenticated, memo.update);
	app.post('/memo/detail', ensureAuthenticated, memo.detail);
	app.post('/memo/list', ensureAuthenticated, memo.list);

	var docs = require(__dirname + '/docs.js');
	app.post('/docs/create', ensureAuthenticated, docs.create);
	app.post('/docs/remove', ensureAuthenticated, docs.remove);
	app.post('/docs/update', ensureAuthenticated, docs.update);
	app.post('/docs/detail', ensureAuthenticated, docs.detail);
	app.post('/docs/list', ensureAuthenticated, docs.list);

	var calendar = require(__dirname + '/calendar.js');
	app.post('/calendar/create', ensureAuthenticated, calendar.create);
	app.post('/calendar/remove', ensureAuthenticated, calendar.remove);
	app.post('/calendar/update', ensureAuthenticated, calendar.update);
	app.post('/calendar/detail', ensureAuthenticated, calendar.detail);
	app.post('/calendar/list', ensureAuthenticated, calendar.list);

	var projects = require(__dirname + '/projects.js');
	app.post('/projects/create', ensureAuthenticated, projects.create);
	app.post('/projects/remove', ensureAuthenticated, projects.remove);
	app.post('/projects/update', ensureAuthenticated, projects.update);
	app.post('/projects/detail', ensureAuthenticated, projects.detail);
	app.post('/projects/list', ensureAuthenticated, projects.list);

	var relations = require(__dirname + '/relations.js');
	app.post('/relations/create', ensureAuthenticated, relations.create);
	app.post('/relations/remove', ensureAuthenticated, relations.remove);
	app.post('/relations/update', ensureAuthenticated, relations.update);
	app.post('/relations/detail', ensureAuthenticated, relations.detail);
	app.post('/relations/list', ensureAuthenticated, relations.list);

	var settings = require(__dirname + '/settings.js');
	app.post('/settings/update', ensureAuthenticated, relations.update);
};


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}