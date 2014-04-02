var passport = require('passport');
var Account = require(__dirname + '/../models/account');

var home = require(__dirname + '/home');
var docs = require(__dirname + '/docs');
var news = require(__dirname + '/news');
var projects = require(__dirname + '/projects');
var calendar = require(__dirname + '/calendar');
var settings = require(__dirname + '/settings');
var register = require(__dirname + '/auth/register');
var login = require(__dirname + '/auth/login');


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

module.exports = function (app) {

	// HOME

	app.get('/', ensureAuthenticated, home.index);
	app.get('/home', ensureAuthenticated, home.index);
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

	app.post('/ajax-login', login.ajaxlogin);
}