var passport = require('passport');
var Account = require('../models/account');

var home = require('./home');
var docs = require('./docs');
var news = require('./news');
var projects = require('./projects');
var calendar = require('./calendar');
var users = require('./users');
var settings = require('./settings');
var register = require('./auth/register');
var login = require('./auth/login');

module.exports = function (app) {

	// HOME

	app.get('/', home.index);
	app.get('/home', home.index);
	app.get('/home/:subpage', home.index);
	app.get('/home/:subpage/:subsubpage', home.index);

	// DOCS

	app.get('/docs', docs.index);

	// NEWS

	app.get('/news', news.index);

	// CALENDAR

	app.get('/calendar', calendar.index);

	// PROJECTS

	app.get('/projects', projects.index);

	// USERS
	
	app.get('/users', users.index);

	// SETTINGS
	
	app.get('/settings', settings.index);

	// AUTHENTICATION

	app.get('/register', register.getregister);
	app.post('/register', register.postregister);

	app.get('/login', login.getlogin);
	app.post('/login', login.postlogin);

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
}