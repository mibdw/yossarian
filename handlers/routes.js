var passport = require('passport');

module.exports = function (app, res, req) {

	// DASHBOARD
	var dashboard = require(__dirname + '/dashboard');

	app.get('/', ensureAuthenticated, dashboard.index);
	app.get('/dashboard', ensureAuthenticated, dashboard.index);

	// DOCS
	var docs = require(__dirname + '/docs');

	app.get('/docs', ensureAuthenticated, docs.index);
	app.get('/docs/:subpage', ensureAuthenticated, docs.subpage);
	app.get('/docs/:subpage/:subsubpage', ensureAuthenticated, docs.subsubpage);

	// NEWS
	var news = require(__dirname + '/news');

	app.get('/news', ensureAuthenticated, news.index);
	app.get('/news/add', ensureAuthenticated, news.getAdd);

	app.post('/news/add', ensureAuthenticated, news.postAdd);
	app.post('/news/ajaxAdd', ensureAuthenticated, news.ajaxAdd);

	// CALENDAR
	var calendar = require(__dirname + '/calendar');

	app.get('/calendar', ensureAuthenticated, calendar.index);

	// PROJECTS
	var projects = require(__dirname + '/projects');

	app.get('/projects', ensureAuthenticated, projects.index);

	// SETTINGS
	var settings = require(__dirname + '/settings');

	app.get('/settings', ensureAuthenticated, settings.index);

	// PROFILE
	var profile = require(__dirname + '/profile');

	app.get('/profile', ensureAuthenticated, profile.index);

	// AUTHENTICATION
	var login = require(__dirname + '/auth/login');
	app.get('/login', login.getLogin);

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.post('/login', login.postLogin);
	app.post('/ajaxLogin', login.ajaxLogin);
}

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}