var passport = require('passport');

var dashboard = require(__dirname + '/dashboard');
var docs = require(__dirname + '/docs');
var news = require(__dirname + '/news');
var projects = require(__dirname + '/projects');
var calendar = require(__dirname + '/calendar');
var settings = require(__dirname + '/settings');

var login = require(__dirname + '/auth/login');

module.exports = function (app, res, req) {

	// DASHBOARD
	app.get('/', ensureAuthenticated, dashboard.index);
	app.get('/dashboard', ensureAuthenticated, dashboard.index);

	// DOCS
	app.get('/docs', ensureAuthenticated, docs.index);
	app.get('/docs/:subpage', ensureAuthenticated, docs.subpage);
	app.get('/docs/:subpage/:subsubpage', ensureAuthenticated, docs.subsubpage);

	// NEWS
	app.get('/news', ensureAuthenticated, news.index);
	app.get('/news/add', ensureAuthenticated, news.addition);

	// CALENDAR
	app.get('/calendar', ensureAuthenticated, calendar.index);

	// PROJECTS
	app.get('/projects', ensureAuthenticated, projects.index);

	// SETTINGS
	app.get('/settings', ensureAuthenticated, settings.index);

	// AUTHENTICATION
	app.get('/login', login.getlogin);

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/login', login.postlogin);
	app.post('/ajax-login', login.ajaxlogin);
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}